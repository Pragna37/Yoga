import bcryptjs from 'bcryptjs'; // Importing bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for token generation
import userModel from '../models/userModel.js'; // Importing the user model
import transporter from '../config/nodeMailer.js'; // Importing the nodemailer transporter



export const register = async (req, res) => {
    const { name, email, password } = req.body; // Extracting user details from request body
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required', success:false }); // Check for missing fields
    }
    try{
        const existingUser = await userModel.findOne({ email }); // Check if user already exists
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', success:false }); // User already exists
        }

        const hashedPassword = await bcryptjs.hash(password, 10); // Hashing the password
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword, // Storing the hashed password
        });
        await newUser.save(); // Saving the new user to the database
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Generating a JWT token
        res.cookie('token', token, {
            httpOnly: true, // Cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV=='production'? 'none':"strict",
             // Cookie is sent only for same-site requests
             maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL, // Sender email from environment variables
            to: email, // Recipient email
            subject: 'Welcome to Our Service', // Email subject
            text: `Hello ${name},\n\nThank you for registering with us!` // Email body
        };
        // Sending welcome email
        await transporter.sendMail(mailOptions); // Using nodemailer to send the email
        console.log('Registration successful, email sent to:', email); // Log success message
        // Responding with success message


        res.json({ message: 'Registration successful', success:true }); // Respond with success message
    }catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: error.message, success:false });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body; // Extracting user credentials from request body
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required', success:false }); // Check for missing fields
    }
    try {
        const user = await userModel.findOne({ email }); // Find user by email
        if (!user) {
            return res.status(400).json({ message: 'Invalid email', success:false }); // User not found
        }
        const isMatch = await bcryptjs.compare(password, user.password); // Compare provided password with stored hashed password
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password', success:false }); // Password does not match
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Generate JWT token
        res.cookie('token', token, {
            httpOnly: true, // Cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV=='production'?'none':'strict',
             // Cookie is sent only for same-site requests
             maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
        });
        res.json({ message: 'Login successful', success:true }); // Respond with success message
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: error.message, success:false });
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token'); // Clear the authentication cookie
        res.json({ message: 'Logout successful', success:true }); // Respond with success message
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: error.message, success:false });
    }
}






export const sendResetOtp = async (req, res) => {
    const {email} = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required', success:false }); // Check for missing email
    }
    try {
        const user = await userModel.findOne({ email }); // Find user by email
        if (!user) {
            return res.status(404).json({ message: 'User not found', success:false }); // User not found
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate a random OTP
        user.resetOtp = otp; // Set the OTP
        user.resetOtpExpire = Date.now() + 24 * 60 *60* 1000; // Set OTP expiration time (10 minutes)
        await user.save(); // Save the updated user
        const mailOptions = {
            from: process.env.SENDER_EMAIL, // Sender email from environment variables
            to: email, // Recipient email
            subject: 'Password Reset OTP', // Email subject
            text: `Your password reset OTP is ${otp}. It is valid for 24 hours.` // Email body with OTP
        };
        await transporter.sendMail(mailOptions); // Send the password reset email
        return res.json({ message: 'Password reset OTP sent', success:true }); // Respond with
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ message: error.message, success:false });
}
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body; // Extracting email, OTP, and new password from request body
    if (!email || !otp || !newPassword) {   
        return res.status(400).json({ message: 'All fields are required', success:false }); // Check for missing fields
    }
    try {
        const user = await userModel.findOne({ email }); // Find user by email
        if (!user) {
            return res.status(404).json({ message: 'User not found', success:false }); // User not found
        }
        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP', success:false }); // Invalid OTP
        }
        if (user.resetOtpExpire < Date.now()) {
            return res.status(400).json({ message: 'OTP expired', success:false }); // OTP expired
        }
        const hashedPassword = await bcryptjs.hash(newPassword, 10); // Hash the new password
        user.password = hashedPassword; // Update the user's password
        user.resetOtp = ''; // Clear the OTP
        user.resetOtpExpire = 0; // Clear the OTP expiration time
        await user.save(); // Save the updated user
        return res.json({ message: 'Password reset successfully', success:true }); // Respond with success message
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ message: error.message, success:false });
    }
}
export default { register, login, logout,resetPassword , sendResetOtp }; // Exporting the functions for use in routes