import User from '../models/User';
import { createAppError } from '../utils/createAppError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = async (input) => {
    const { email, password } = input;
    // should check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createAppError('User with this email already exists', 400);
    }
    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({ 
        name: input.name, 
        email, 
        password: hash });
    const output = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
    }
    return output;
}

const login = async (input) => {
    const { email, password } = input;
    const user = await User.findOne({ email });
    if (!user) {
        throw createAppError('Invalid email or password', 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createAppError('Invalid email or password', 401);
    }
    const token = jwt.sign({ 
        userId: user._id }, 
        process.env.JWT_SECRET, { expiresIn: '1h' });
    const output = {
        id: user._id,
        name: user.name,
        email: user.email,
        token
    }
    return output;
}

export default {
    register,
    login
}