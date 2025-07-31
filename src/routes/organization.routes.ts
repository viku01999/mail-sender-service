import { Router } from 'express';
import { OrganizationController } from '../controller/OrganizationController';

const router = Router();
const organizationController = new OrganizationController();

router.post('/create-organizations', organizationController.createOrganization);
router.get('/organizations', organizationController.getOrganizationDetails);
router.get('/organizations/id', organizationController.getOrganizationById);
router.put('/organizations', organizationController.updateOrganization);
router.delete('/organizations', organizationController.deleteOrganization);

export default router;
