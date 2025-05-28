import passport from 'passport';
import { AuthService } from '../services/authService.js';

const authService = new AuthService();

export class AuthController {
    register = async (req, res, next) => {
        try {
            const deviceInfo = {
                userAgent: req.get('User-Agent'),
                ip: req.ip
            };

            const result = await authService.register(req.body);

            // Configurar cookie HttpOnly para refresh token
            this.setRefreshTokenCookie(res, result.refreshToken);

            res.status(201).json({
                success: true,
                data: {
                    user: result.user,
                    accessToken: result.accessToken
                }
            });
        } catch (error) {
            next(error);
        }
    }

    login = (req, res, next) => {
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

                const deviceInfo = {
                    userAgent: req.get('User-Agent'),
                    ip: req.ip
                };

                const result = await authService.login(req.body.email, req.body.password, deviceInfo);

                // Configurar cookie HttpOnly para refresh token
                this.setRefreshTokenCookie(res, result.refreshToken);

                res.json({
                    success: true,
                    data: {
                        user: result.user,
                        accessToken: result.accessToken
                    }
                });
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    }

    refreshToken = async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Refresh token not found'
                });
            }

            const result = await authService.refreshToken(refreshToken);

            // Configurar nueva cookie HttpOnly para el nuevo refresh token
            this.setRefreshTokenCookie(res, result.refreshToken);

            res.json({
                success: true,
                data: {
                    user: result.user,
                    accessToken: result.accessToken
                }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }
    }

    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (refreshToken) {
                await authService.logout(refreshToken);
            }

            // Limpiar cookie de refresh token
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    async logoutAllDevices(req, res, next) {
        try {
            await authService.logoutAllDevices(req.user._id);

            // Limpiar cookie de refresh token
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            res.json({
                success: true,
                message: 'Logged out from all devices successfully'
            });
        } catch (error) {
            next(error);
        }
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
    googleAuth = (req, res, next) => {
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })(req, res, next);
    }

    googleAuthCallback = (req, res, next) => {
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

                const deviceInfo = {
                    userAgent: req.get('User-Agent'),
                    ip: req.ip
                };

                const result = await authService.googleAuthCallback(user, deviceInfo);

                // Configurar cookie HttpOnly para refresh token
                this.setRefreshTokenCookie(res, result.refreshToken);

                // Redirigir a frontend con access token en URL (temporal)
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                res.redirect(`${frontendUrl}/login/success?token=${result.accessToken}`);
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    }

    // Método auxiliar para configurar cookie de refresh token
    setRefreshTokenCookie(res, refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
            path: '/'
        });
    }
}