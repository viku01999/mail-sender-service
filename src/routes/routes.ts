import { Router } from 'express';
import organizationRoutes from './organization.routes';
import mailConfigurationRoutes from './mailConfiguration.routes';
import mailSenderRoutes from './mailSender.routes';

const router = Router();

router.use('/organization', organizationRoutes);
router.use('/config', mailConfigurationRoutes);
router.use('/mail-sender', mailSenderRoutes);

export default router;
