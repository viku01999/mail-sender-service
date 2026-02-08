import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../error/NotFoundError';
import { KafkaConfigurationService } from '../service/kafkaConfiguration.service';
import { ICreateKafkaConfigurationInput } from '../schemas/kafkaConfiguration.schema';

const kafkaConfigurationService = new KafkaConfigurationService();

export class KafkaConfigurationController {
  async createKafkaConfiguration(req: Request<{}, {}, ICreateKafkaConfigurationInput>, res: Response, next: NextFunction): Promise<void> {
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
      console.error(`[CONTROLLER ERROR] Error in createKafkaConfiguration:`, error);
      next(error);
    }
  }

  async getKafkaConfigurations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const kafkaConfigs = await kafkaConfigurationService.getKafkaConfigurations();
      res.status(200).json({
        success: true,
        data: kafkaConfigs,
      });
    } catch (error: any) {
      console.error(`[CONTROLLER ERROR] Error in getKafkaConfigurations:`, error);
      next(error);
    }
  }

  async getKafkaConfigurationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const kafkaConfigId = Array.isArray(req.params.kafkaConfigId)
        ? req.params.kafkaConfigId[0]
        : req.params.kafkaConfigId;

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
      console.error(`[CONTROLLER ERROR] Error in getKafkaConfigurationById:`, error);
      next(error);
    }
  }

  async updateKafkaConfiguration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const kafkaConfigId = Array.isArray(req.params.kafkaConfigId)
        ? req.params.kafkaConfigId[0]
        : req.params.kafkaConfigId;

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
      console.error(`[CONTROLLER ERROR] Error in updateKafkaConfiguration:`, error);
      next(error);
    }
  }

  async deleteKafkaConfiguration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const kafkaConfigId = Array.isArray(req.params.kafkaConfigId)
        ? req.params.kafkaConfigId[0]
        : req.params.kafkaConfigId;

      await kafkaConfigurationService.deleteKafkaConfiguration(kafkaConfigId);
      res.status(204).send();
    } catch (error: any) {
      console.error(`[CONTROLLER ERROR] Error in deleteKafkaConfiguration:`, error);
      next(error);
    }
  }
}
