import User from '../models/User.js';
import { createAppError } from '../utils/createAppError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (input) => {
    const { email, password } = input;
    // should check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createAppError('User with this email already exists', 400);
    }
    const hash = await bcrypt.hash(password, 10);

    // user will be saved into database with hashed password
    const newUser = await User.create({ 
        name: input.name, 
        email, 
        password: hash });
    
    // return user data without password
    const output = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
    }
    return output;
}

export const login = async (input) => {
    const { email, password } = input;
    const user = await User.findOne({ email });
    if (!user) {
        throw createAppError('Invalid email or password', 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createAppError('Invalid email or password', 401);
    }

    // jwt helps in creating a token that can be used for authentication in subsequent requests
    const token = jwt.sign({ 
        userId: user._id }, // Data that goes into the token payload
        process.env.JWT_SECRET, // Secret key used to sign the token, should be stored in environment variables
        { expiresIn: '1h' });

    const output = {
        id: user._id,
        name: user.name,
        email: user.email,
        token
    }
    return output;
}