import { Request, Response, NextFunction } from "express";
import { VerificationService } from "../service/verificationProcess.service";
import { AppError } from "../error/AppError";


const verificationService = new VerificationService();

export class VerificationOTPController {

    async sentOTPToRequestedLocation(req: Request<{}, {}, {}, { email?: string, phone?: string, method: string }>, res: Response, next: NextFunction): Promise<void> {
        const email = req.query.email;
        const phone = req.query.phone;
        const method = req.query.method;


        if (!method) {
            res.status(400).json({
                success: false,
                message: "Method is required. Options (phone, mail)"
            })
            return;
        }

        if (method !== 'phone' && method !== 'email') {
            res.status(400).json({
                success: false,
                message: "Method must be either 'phone' or 'email'"
            });
            return;
        }

        let receiverId: string;

        if (method === 'phone') {
            if (!phone) {
                res.status(400).json({
                    success: false,
                    message: "Phone is required when method is 'phone'"
                });
                return;
            }
            receiverId = phone;
        } else {
            if (!email) {
                res.status(400).json({
                    success: false,
                    message: "Email is required when method is 'email'"
                });
                return;
            }
            receiverId = email;
        }

        if (email && phone) {
            res.status(400).json({
                success: false,
                message: "Provide either email or phone, not both"
            });
            return;
        }


        try {
            await verificationService.sentOtpToUserViaRequestedMethod(method, receiverId);
            res.status(201).json({
                success: true,
                message: "SudoSys OTP sent successfully.",
            });
        } catch (error: any) {
            console.error(`[CONTROLLER ERROR] Error in sentOTPToRequestedLocation:`, error);
            next(error);
        }
    }

    async checkOTPValidOrNot(req: Request<{}, {}, {}, { otp: string, receiver: string }>, res: Response, next: NextFunction): Promise<void> {
        const receiver = req.query.receiver
        const otp = req.query.otp

        if (!receiver || !otp) {
            res.status(400).json({
                success: false,
                message: "Please provide both the receiver ID (email or phone number) and the OTP."
            });
            return;
        }

        try {
            await verificationService.compareNewOTPWithLatest(otp, receiver);
            res.status(201).json({
                success: true,
                message: "OTP is verified.",
            });
        } catch (error: any) {
            console.error(`[CONTROLLER ERROR] Error in checkOTPValidOrNot:`, error);
            next(error);
        }
    }
}