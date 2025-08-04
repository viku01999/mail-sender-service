import { Router } from 'express';
import { KafkaConfigurationController } from '../controller/KafkaConfigurationController';

const router = Router();
const kafkaConfigurationController = new KafkaConfigurationController();

router.post('/kafka-configurations', kafkaConfigurationController.createKafkaConfiguration);
router.get('/kafka-configurations', kafkaConfigurationController.getKafkaConfigurations);
router.get('/kafka-configurations/:kafkaConfigId', kafkaConfigurationController.getKafkaConfigurationById);
router.put('/kafka-configurations/:kafkaConfigId', kafkaConfigurationController.updateKafkaConfiguration);
router.delete('/kafka-configurations/:kafkaConfigId', kafkaConfigurationController.deleteKafkaConfiguration);

export default router;
