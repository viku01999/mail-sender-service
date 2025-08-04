import { Request, Response } from 'express';
import { NotFoundError } from '../error/NotFoundError';
import { KafkaConfigurationService } from '../service/kafkaConfiguration.service';
import { ICreateKafkaConfigurationInput } from '../schemas/kafkaConfiguration.schema';

const kafkaConfigurationService = new KafkaConfigurationService();

export class KafkaConfigurationController {
  async createKafkaConfiguration(req: Request<{}, {}, ICreateKafkaConfigurationInput>, res: Response): Promise<void> {
    const clientId = req.header('clientId');
    const clientSecret = req.header('clientSecret');

    if (!clientId || !clientSecret) {
      res.status(400).json({
        success: false,
        message: 'Client ID and Client Secret are required',
        data: null,
      });
      return;
    }

    try {
      const kafkaConfig = await kafkaConfigurationService.createKafkaConfiguration(req.body, clientId, clientSecret);
      res.status(201).json({
        success: true,
        message: 'Kafka Configuration created successfully',
        data: kafkaConfig,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async getKafkaConfigurations(req: Request, res: Response): Promise<void> {
    try {
      const kafkaConfigs = await kafkaConfigurationService.getKafkaConfigurations();
      res.status(200).json({
        success: true,
        data: kafkaConfigs,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getKafkaConfigurationById(req: Request, res: Response): Promise<void> {
    try {
      const { kafkaConfigId } = req.params;
      const kafkaConfig = await kafkaConfigurationService.getKafkaConfigurationById(kafkaConfigId);
      if (!kafkaConfig) {
        res.status(404).json({
          success: false,
          message: 'Kafka Configuration not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: kafkaConfig,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateKafkaConfiguration(req: Request, res: Response): Promise<void> {
    try {
      const { kafkaConfigId } = req.params;
      const kafkaConfig = await kafkaConfigurationService.updateKafkaConfiguration(kafkaConfigId, req.body);
      if (!kafkaConfig) {
        res.status(404).json({
          success: false,
          message: 'Kafka Configuration not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Kafka Configuration updated successfully',
        data: kafkaConfig,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteKafkaConfiguration(req: Request, res: Response): Promise<void> {
    try {
      const { kafkaConfigId } = req.params;
      await kafkaConfigurationService.deleteKafkaConfiguration(kafkaConfigId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
