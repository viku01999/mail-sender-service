import { Router } from 'express';
import organizationRoutes from './organization.routes';
import mailConfigurationRoutes from './mailConfiguration.routes';
import mailSenderRoutes from './mailSender.routes';
import verificationRoutes from "./verification.routes"

const router = Router();

router.use('/organization', organizationRoutes);
router.use('/config', mailConfigurationRoutes);
router.use('/mail-sender', mailSenderRoutes);
router.use("/verification-process", verificationRoutes)

export default router;
