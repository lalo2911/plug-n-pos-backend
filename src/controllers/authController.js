import passport from 'passport';
import crypto from 'crypto';
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
                    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                    return res.redirect(`${frontendUrl}/login?error=server_error`);
                }

                if (!user) {
                    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                    return res.redirect(`${frontendUrl}/login?error=auth_failed`);
                }

                const deviceInfo = {
                    userAgent: req.get('User-Agent'),
                    ip: req.ip
                };

                const result = await authService.googleAuthCallback(user, deviceInfo);

                // Configurar cookie HttpOnly para refresh token
                this.setRefreshTokenCookie(res, result.refreshToken);

                // Almacenar temporalmente el access token en memoria del servidor
                // y redirigir con un código de autorización temporal
                const tempAuthCode = this.generateTempAuthCode();
                this.storeTempAuthData(tempAuthCode, {
                    user: result.user,
                    accessToken: result.accessToken
                });

                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                res.redirect(`${frontendUrl}/login/success?code=${tempAuthCode}`);
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    }

    // Intercambiar el código temporal por los datos de autenticación
    exchangeAuthCode = async (req, res, next) => {
        try {
            const { code } = req.body;

            if (!code) {
                return res.status(400).json({
                    success: false,
                    message: 'Authorization code required'
                });
            }

            const authData = this.getTempAuthData(code);

            if (!authData) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired authorization code'
                });
            }

            // Eliminar el código temporal después de usarlo
            this.deleteTempAuthData(code);

            res.json({
                success: true,
                data: authData
            });
        } catch (error) {
            next(error);
        }
    }

    // Auxiliares para manejar códigos temporales
    generateTempAuthCode() {
        return crypto.randomBytes(32).toString('hex');
    }

    storeTempAuthData = (code, data) => {
        // Almacenar en memoria con expiración de 5 minutos
        if (!global.tempAuthStore) {
            global.tempAuthStore = new Map();
        }

        global.tempAuthStore.set(code, {
            data,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutos
        });

        // Limpiar códigos expirados
        this.cleanExpiredAuthCodes();
    }

    getTempAuthData(code) {
        if (!global.tempAuthStore) return null;

        const entry = global.tempAuthStore.get(code);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            global.tempAuthStore.delete(code);
            return null;
        }

        return entry.data;
    }

    deleteTempAuthData(code) {
        if (global.tempAuthStore) {
            global.tempAuthStore.delete(code);
        }
    }

    cleanExpiredAuthCodes() {
        if (!global.tempAuthStore) return;

        const now = Date.now();
        for (const [code, entry] of global.tempAuthStore.entries()) {
            if (now > entry.expiresAt) {
                global.tempAuthStore.delete(code);
            }
        }
    }

    // Configurar cookie de refresh token
    setRefreshTokenCookie(res, refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 6 * 60 * 60 * 1000 // 6 horas
        });
    }
}