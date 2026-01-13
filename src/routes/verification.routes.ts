import { Router } from 'express';
import { VerificationOTPController } from '../controller/VerificationProcessController';
import { apiKeyMiddleware } from '../middleware/apiKeyMiddleware';

const router = Router();
const verificationController = new VerificationOTPController();


router.post("/sendOTP", apiKeyMiddleware, verificationController.sentOTPToRequestedLocation);
router.get("/verifyOTP", apiKeyMiddleware, verificationController.checkOTPValidOrNot)


export default router;
