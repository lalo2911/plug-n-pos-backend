import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/userModel.js';

// Local Strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            // Buscar usuario por email
            const user = await User.findOne({ email });

            // Verificar si el usuario existe
            if (!user) {
                return done(null, false, { message: 'Invalid credentials' });
            }

            // Verificar si el usuario es de autenticación local
            if (user.authSource !== 'local') {
                return done(null, false, { message: `Please login with ${user.authSource}` });
            }

            // Verificar contraseña
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid credentials' });
            }

            // Todo correcto, devolver usuario
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Google Strategy
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/api/v1/auth/google/callback`
    },
    async (profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;

            if (!email) {
                return done(new Error('No email found in Google profile'));
            }

            // Buscar usuario por email
            let user = await User.findOne({ email });

            if (user) {
                // Actualizar datos opcionales
                user.authSource = 'google';
                if (!user.name) user.name = profile.displayName;
                if (!user.avatar && profile.photos?.length > 0) {
                    user.avatar = profile.photos[0].value;
                }
                await user.save();
                return done(null, user);
            }

            // Crear un nuevo usuario con datos de Google
            const newUser = await User.create({
                name: profile.displayName,
                email,
                authSource: 'google',
                avatar: profile.photos?.[0]?.value
            });

            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;