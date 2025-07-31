import { Router } from 'express';
import { MailConfigurationController } from '../controller/MailConfigurationController';

const router = Router();
const mailConfigurationController = new MailConfigurationController();

router.post('/mail-configurations', mailConfigurationController.createMailConfiguration);
router.get('/mail-configurations', mailConfigurationController.getMailConfigurations);
router.get('/mail-configurations/id', mailConfigurationController.getMailConfigurationById);
router.put('/mail-configurations', mailConfigurationController.updateMailConfiguration);
router.patch('/mail-configurations/make-default', mailConfigurationController.makeDefaultMailConfiguration);
router.delete('/mail-configurations', mailConfigurationController.deleteMailConfiguration);

export default router;
