import { Repository } from "typeorm";
import { PostgresDataSource } from "../config/PostgresDataSource";
import { OTPVerification } from "../entity/OTPVerification";




export const VerificationRepository: Repository<OTPVerification> =
    PostgresDataSource.getRepository(OTPVerification);

export const findLatestOtpByReceiver = async (
    emailOrPhone: string
): Promise<OTPVerification | null> => {
    return await VerificationRepository.findOne({
        where: { emailOrPhone: emailOrPhone },
        order: { createdAt: 'DESC' }
    });
};

export const markOtpAsVerified = async (
    verificationId: string
): Promise<void> => {
    await VerificationRepository.update(
        { verificationId },
        { isVerified: true }
    );
};

export const deleteOtpByReceiver = async (receiverId: string): Promise<void> => {
    await VerificationRepository.delete({ emailOrPhone: receiverId });
};