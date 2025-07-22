import { Router } from 'express';
import organizationRoutes from './organization.routes';
import mailConfigurationRoutes from './mailConfiguration.routes';

const router = Router();

router.use('/organization', organizationRoutes);
router.use('/config', mailConfigurationRoutes);

export default router;
