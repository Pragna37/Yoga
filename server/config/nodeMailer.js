import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();



const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS - Brevo requires STARTTLS
    auth: {
        user:'pragna902@gmail.com',
        pass: 'ymfhpfjbdnrnnwmy',
    },
});

export default transporter;
