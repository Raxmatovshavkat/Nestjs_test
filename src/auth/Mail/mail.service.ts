import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendEmail(email: string, otp: string): Promise<void> {
        await this.transporter.sendMail({
            to: email,
            from: process.env.EMAIL_USERNAME,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
            html: `<b>Your OTP code is:${otp}</b>`,
        });
    }
}
