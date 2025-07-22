import { Router, Request, Response } from 'express';
import { OrganizationController } from '../controller/OrganizationController';

const router = Router();
const organizationController = new OrganizationController();

router.post('/organizations', (req: Request, res: Response) => organizationController.createOrganization(req, res));
router.get('/organizations', (req: Request, res: Response) => organizationController.getOrganizationDetails(req, res));
router.get('/organizations/id', (req: Request<{}, {}, {}, { organizationId: string }>, res: Response) =>
  organizationController.getOrganizationById(req as Request<{}, {}, {}, { organizationId: string }>, res)
);
router.put('/organizations', (req: Request<{}, {}, {}, { organizationId: string }>, res: Response) =>
  organizationController.updateOrganization(req as Request<{}, {}, {}, { organizationId: string }>, res)
);
router.delete('/organizations', (req: Request<{}, {}, {}, { organizationId: string }>, res: Response) =>
  organizationController.deleteOrganization(req as Request<{}, {}, {}, { organizationId: string }>, res)
);

export default router;
