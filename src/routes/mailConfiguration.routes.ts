import { Router, Request, Response } from 'express';
import { MailConfigurationController } from '../controller/MailConfigurationController';

const router = Router();
const mailConfigurationController = new MailConfigurationController();

router.post('/mail-configurations', (req: Request, res: Response) => mailConfigurationController.createMailConfiguration(req, res));
router.get('/mail-configurations', (req: Request, res: Response) => mailConfigurationController.getMailConfigurations(req, res));
router.get('/mail-configurations/id', (req: Request<{}, {}, {}, { mailConfigId: string }>, res: Response) =>
  mailConfigurationController.getMailConfigurationById(req as Request<{}, {}, {}, { mailConfigId: string }>, res)
);
router.put('/mail-configurations', (req: Request<{}, {}, {}, { mailConfigId: string }>, res: Response) =>
  mailConfigurationController.updateMailConfiguration(req as Request<{}, {}, {}, { mailConfigId: string }>, res)
);
router.delete('/mail-configurations', (req: Request<{}, {}, {}, { mailConfigId: string }>, res: Response) =>
  mailConfigurationController.deleteMailConfiguration(req as Request<{}, {}, {}, { mailConfigId: string }>, res)
);
router.post('/mail-configurations/increment', (req: Request<{}, {}, { incrementBy?: number }, { mailConfigId: string }>, res: Response) =>
  mailConfigurationController.incrementNumberOfMailSent(req as Request<{}, {}, { incrementBy?: number }, { mailConfigId: string }>, res)
);

export default router;
