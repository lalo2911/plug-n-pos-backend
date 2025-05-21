import passport from 'passport';
import { AuthService } from '../services/authService.js';

const authService = new AuthService();

export class AuthController {
    async register(req, res, next) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    login(req, res, next) {
        passport.authenticate('local', async (err, user, info) => {
            try {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: info.message || 'Invalid credentials'
                    });
                }

                const userData = await authService.login(req.body.email, req.body.password);
                res.json({ success: true, data: userData });
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    }

    async getProfile(req, res, next) {
        try {
            const user = await authService.getUserProfile(req.user._id);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const user = await authService.updateUserProfile(req.user._id, req.body);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    // Rutas de Google OAuth
    googleAuth(req, res, next) {
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })(req, res, next);
    }

    googleAuthCallback(req, res, next) {
        passport.authenticate('google', { session: false }, async (err, user) => {
            try {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Google authentication failed'
                    });
                }

                const userData = await authService.googleAuthCallback(user);

                // Redirigir a frontend con token JWT
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                res.cookie('auth_token', userData.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
                });
                res.redirect(`${frontendUrl}/login/success`);
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    }
}