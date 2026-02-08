import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { findLatestOtpByReceiver, markOtpAsVerified, VerificationRepository } from '../repository/verificationProcess.repository';
import { OTPVerification } from '../entity/OTPVerification';
import nodemailer from 'nodemailer';
import Twilio from 'twilio';
import 'dotenv/config';
import { NotFoundError } from '../error/NotFoundError';
import { BadRequestError } from '../error/BadRequestError';


export class VerificationService {
    private verificationRepo: typeof VerificationRepository;

    constructor() {
        this.verificationRepo = VerificationRepository;
    }

    async sentOtpToUserViaRequestedMethod(
        method: 'phone' | 'email',
        receiverId: string
    ): Promise<any> {
        const otp = crypto.randomInt(100000, 1000000).toString();
        const hashedOtp = await bcrypt.hash(otp, 12);
        const now = new Date();
        const validTill = new Date(now.getTime() + 10 * 60 * 1000);

        const prepareReqBody: Partial<OTPVerification> = {
            emailOrPhone: receiverId,
            validTill,
            method,
            createdAt: now,
            otp: hashedOtp
        };

        await this.verificationRepo.save(
            this.verificationRepo.create(prepareReqBody)
        );

        if (method === 'email') {
            await this.sendOtpViaEmail(receiverId, otp);
        } else {
            await this.sendOtpViaPhone(receiverId, otp);
        }

        return { success: true, message: `OTP sent via ${method}` };
    }

    private async sendOtpViaEmail(email: string, otp: string): Promise<void> {
        console.log(`[SMTP DIAGNOSTIC]`);
        console.log(`- Host: ${process.env.EMAIL_HOST}`);
        console.log(`- Port: ${process.env.EMAIL_PORT}`);
        console.log(`- Secure: ${process.env.EMAIL_SECURE}`);
        console.log(`- User: ${process.env.EMAIL_USER}`);
        console.log(`- Pass Length: ${process.env.EMAIL_PASS?.length || 0}`);
        if (process.env.EMAIL_PASS) {
            console.log(`- Pass Start: ${process.env.EMAIL_PASS.substring(0, 1)}... End: ${process.env.EMAIL_PASS.slice(-1)}`);
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        try {
            await transporter.sendMail({
                from: `"SudoSys OTP" <${process.env.EMAIL_FROM}>`,
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
            });
        } catch (error) {
            console.error("Error sending email:", error);
        }


        console.log(`OTP ${otp} sent to email ${email}`);
    }

    private async sendOtpViaPhone(phone: string, otp: string): Promise<void> {
        const client = Twilio(
            process.env.TWILIO_ACCOUNT_SID as string,
            process.env.TWILIO_AUTH_TOKEN as string
        );

        await client.messages.create({
            body: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
    }


    async compareNewOTPWithLatest(
        otp: string,
        emailOrPhone: string
    ): Promise<boolean> {

        const existingRecord = await findLatestOtpByReceiver(emailOrPhone);

        if (!existingRecord) {
            throw new NotFoundError("Please try to resend OTP. No record found.");
        }

        if (existingRecord.isVerified) {
            throw new BadRequestError("OTP has already been verified.");
        }

        const now = new Date();
        if (existingRecord.validTill < now) {
            throw new BadRequestError("OTP has expired.");
        }

        const isValid = await bcrypt.compare(otp, existingRecord.otp);

        if (!isValid) {
            throw new BadRequestError("Invalid OTP.");
        }

        await markOtpAsVerified(existingRecord.verificationId);

        return true;
    };

}
