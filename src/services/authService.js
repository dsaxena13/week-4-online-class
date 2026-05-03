import user from '../models/User';

async function register(input) {
    const { email, password } = input;
    // should check if email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
        throw new Error('Email already exists');
    }
    const newUser = await user.create({ email, password });
    return newUser;
}