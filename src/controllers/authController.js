import { register, login } from '../services/authService.js';

export const registerUser = async (req, res) => {

    const user = await register(req.body);
    // 201 status code indicates that a new resource has been successfully created
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
    });
}


export const loginUser = async (req, res) => {

    const user = await login(req.body);
    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: user
    });
}