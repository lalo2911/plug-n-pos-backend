import { User } from '../models/userModel.js';
import { RefreshToken } from '../models/refreshTokenModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';
import wasCreatedRecently from '../utils/dateUtils.js';

export class AuthService {
    async register(userData) {
        const userExists = await User.findOne({ email: userData.email });

        if (userExists) {
            throw new Error('User already exists');
        }

        userData.authSource = 'local';
        const user = await User.create(userData);

        // Generar tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = await this.createRefreshToken(user._id);

        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                authSource: user.authSource
            },
            accessToken,
            refreshToken
        };
    }

    async login(email, password, deviceInfo = {}) {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            throw new Error('Invalid email or password');
        }

        // Generar tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = await this.createRefreshToken(user._id, deviceInfo);

        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                authSource: user.authSource,
                avatar: user.avatar,
                hasCompletedSetup: user.hasCompletedSetup,
                isActive: user.isActive,
                business: user.business
            },
            accessToken,
            refreshToken
        };
    }

    async refreshToken(refreshTokenValue) {
        const oldRefreshToken = await RefreshToken.findOne({
            token: refreshTokenValue,
            isRevoked: false,
            expiresAt: { $gt: new Date() }
        }).populate('userId');

        if (!oldRefreshToken) {
            throw new Error('Invalid or expired refresh token');
        }

        const user = oldRefreshToken.userId;
        if (!user || !user.isActive) {
            throw new Error('User not found or inactive');
        }

        // Generar nuevo access token
        const newAccessToken = generateAccessToken(user._id);

        let newRefreshTokenValue;
        const threshold = parseInt(process.env.REFRESH_ROTATION_THRESHOLD_MINUTES || '60');

        // Semirrotación: solo si el token es viejo se rota
        if (wasCreatedRecently(oldRefreshToken.createdAt, threshold)) {
            // Se reutiliza
            newRefreshTokenValue = oldRefreshToken.token;
        } else {
            // Se rota
            oldRefreshToken.isRevoked = true;
            await oldRefreshToken.save();

            const newRefreshToken = await this.createRefreshToken(user._id);
            newRefreshTokenValue = newRefreshToken.token;
        }

        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                authSource: user.authSource,
                avatar: user.avatar,
                hasCompletedSetup: user.hasCompletedSetup,
                isActive: user.isActive,
                business: user.business
            },
            accessToken: newAccessToken,
            refreshToken: newRefreshTokenValue
        };
    }

    async logout(refreshTokenValue) {
        if (refreshTokenValue) {
            await RefreshToken.updateOne(
                { token: refreshTokenValue },
                { isRevoked: true }
            );
        }
    }

    async logoutAllDevices(userId) {
        await RefreshToken.updateMany(
            { userId, isRevoked: false },
            { isRevoked: true }
        );
    }

    async createRefreshToken(userId, deviceInfo = {}) {
        const token = generateRefreshToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (6 * 60 * 60 * 1000)); // 6 horas

        await RefreshToken.create({
            token,
            userId,
            expiresAt,
            deviceInfo
        });

        return token;
    }

    async getUserProfile(userId) {
        const user = await User.findById(userId).select('-password');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async updateUserProfile(userId, userData) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        user.name = userData.name || user.name;
        user.email = userData.email || user.email;

        if (userData.password) {
            if (!userData.currentPassword) {
                const error = new Error('Debes ingresar tu contraseña actual para cambiarla');
                error.status = 400;
                throw error;
            }

            const isMatch = await user.matchPassword(userData.currentPassword);
            if (!isMatch) {
                const error = new Error('La contraseña actual es incorrecta');
                error.status = 401;
                throw error;
            }

            user.password = userData.password;
        }

        const updatedUser = await user.save();

        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            authSource: updatedUser.authSource,
            avatar: updatedUser.avatar
        };
    }

    async googleAuthCallback(user, deviceInfo = {}) {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = await this.createRefreshToken(user._id, deviceInfo);

        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                authSource: user.authSource,
                avatar: user.avatar,
                hasCompletedSetup: user.hasCompletedSetup,
                isActive: user.isActive,
                business: user.business
            },
            accessToken,
            refreshToken
        };
    }
}