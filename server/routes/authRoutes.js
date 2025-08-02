import express from 'express';
import {register,  logout, login , resetPassword, sendResetOtp } from '../controllers/authController.js';
//import login from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js'; // Middleware for user authentication

const authRoutes = express.Router();



authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
//authRoutes.post('/send-verify-otp', userAuth, sendVerificationEmail); // Route to send verification email
//authRoutes.post('/verify-account', userAuth,verifyEmail); // Route for email verification
//authRoutes.post('/is-auth', userAuth, isAuthenticated); // Route for user logout
authRoutes.post('/send-reset-otp', sendResetOtp); // Route to send reset OTP
authRoutes.post('/reset-password',  resetPassword); // Route for resetting password
export default authRoutes; // Exporting the authentication routes for use in the server