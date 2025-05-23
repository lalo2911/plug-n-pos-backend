import { User } from '../models/userModel.js';
import { generateToken } from '../utils/jwtUtils.js';

export class AuthService {
    async register(userData) {
        // Check if user already exists
        const userExists = await User.findOne({ email: userData.email });

        if (userExists) {
            throw new Error('User already exists');
        }

        // Create user with authSource as 'local'
        userData.authSource = 'local';
        const user = await User.create(userData);

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            authSource: user.authSource,
            token: generateToken(user._id)
        };
    }

    async login(email, password) {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            throw new Error('Invalid email or password');
        }

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            authSource: user.authSource,
            avatar: user.avatar,
            token: generateToken(user._id),
            hasCompletedSetup: user.hasCompletedSetup,
            isActive: user.isActive,
            business: user.business
        };
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
            user.password = userData.password;
        }

        const updatedUser = await user.save();

        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            authSource: updatedUser.authSource,
            avatar: updatedUser.avatar,
            token: generateToken(updatedUser._id)
        };
    }

    async googleAuthCallback(user) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            authSource: user.authSource,
            avatar: user.avatar,
            token: generateToken(user._id)
        };
    }
}
