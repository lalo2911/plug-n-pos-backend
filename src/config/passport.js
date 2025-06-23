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
            // Verificar si el usuario ya existe con este googleId
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Verificar si el email ya está registrado
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Actualizar el usuario existente con datos de Google
                user.googleId = profile.id;
                user.authSource = 'google';
                if (!user.name) user.name = profile.displayName;
                if (!user.avatar && profile.photos && profile.photos.length > 0) {
                    user.avatar = profile.photos[0].value;
                }
                await user.save();
                return done(null, user);
            }

            // Crear un nuevo usuario con datos de Google
            const newUser = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                authSource: 'google',
                avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined
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