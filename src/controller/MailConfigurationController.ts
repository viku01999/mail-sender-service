import { Request, Response } from 'express';
import { AppError } from '../error/AppError';
import {
  ICreateMailConfigurationInput,
  UpdateMailConfigurationInput,
  createMailConfigurationSchema,
  mailConfigIdQuerySchema,
  updateMailConfigurationSchema
} from '../schemas/mailConfiguration.schema';
import { MailConfigurationService } from '../service/mailConfiguration.service';



const mailConfigurationService = new MailConfigurationService();


export class MailConfigurationController {
  async createMailConfiguration(req: Request<{}, {}, ICreateMailConfigurationInput>, res: Response): Promise<void> {
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

    const parseResult = createMailConfigurationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        data: parseResult.error.issues,
      });
      return;
    }

    try {
      const mailConfig = await mailConfigurationService.createMailConfiguration(parseResult.data, clientId, clientSecret);
      res.status(201).json({
        success: true,
        message: 'Mail Configuration created successfully',
        data: mailConfig,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }
  

  async makeDefaultMailConfiguration(req: Request, res: Response): Promise<void> {
    const clientId = req.header('clientId');
    const clientSecret = req.header('clientSecret');
    const { mailConfigId } = req.body;

    if (!clientId || !clientSecret) {
      res.status(400).json({
        success: false,
        message: 'Client ID and Client Secret are required',
        data: null,
      });
      return;
    }

    if (!mailConfigId) {
      res.status(400).json({
        success: false,
        message: 'Mail Configuration ID is required',
        data: null,
      });
      return;
    }

    try {
      const updatedMailConfig = await mailConfigurationService.makeDefaultMailConfiguration(mailConfigId, clientId, clientSecret);
      res.status(200).json({
        success: true,
        message: 'Mail Configuration set as default successfully',
        data: updatedMailConfig,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }


  async getMailConfigurations(req: Request, res: Response): Promise<void> {
    try {
      const mailConfigs = await mailConfigurationService.getMailConfigurations();
      res.status(200).json({
        success: true,
        data: mailConfigs,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  async getMailConfigurationById(req: Request<{}, {}, {}, { mailConfigId: string }>, res: Response): Promise<void> {
    try {
      const queryValidation = mailConfigIdQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameter',
          data: queryValidation.error.issues,
        });
        return;
      }
      const { mailConfigId } = queryValidation.data;
      const mailConfig = await mailConfigurationService.getMailConfigurationById(mailConfigId);
      if (!mailConfig) {
        res.status(404).json({
          success: false,
          message: 'Mail Configuration not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: mailConfig,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  async updateMailConfiguration(req: Request<{}, {}, UpdateMailConfigurationInput, { mailConfigId: string }>, res: Response): Promise<void> {
    const parseResult = updateMailConfigurationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        data: parseResult.error.issues,
      });
      return;
    }
    try {
      const queryValidation = mailConfigIdQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameter',
          data: queryValidation.error.issues,
        });
        return;
      }
      const { mailConfigId } = queryValidation.data;
      const updatedMailConfig = await mailConfigurationService.updateMailConfiguration(mailConfigId, parseResult.data);
      res.status(200).json({
        success: true,
        message: 'Mail Configuration updated successfully',
        data: updatedMailConfig,
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          data: null,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          data: null,
        });
      }
    }
  }


  async deleteMailConfiguration(req: Request<{}, {}, {}, { mailConfigId: string }>, res: Response): Promise<void> {
    try {
      const queryValidation = mailConfigIdQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameter',
          data: queryValidation.error.issues,
        });
        return;
      }
      const { mailConfigId } = queryValidation.data;
      await mailConfigurationService.deleteMailConfiguration(mailConfigId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  async incrementNumberOfMailSent(req: Request<{}, {}, { incrementBy?: number }, { mailConfigId: string }>, res: Response): Promise<void> {
    try {
      const queryValidation = mailConfigIdQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameter',
          data: queryValidation.error.issues,
        });
        return;
      }
      const { mailConfigId } = queryValidation.data;
      const incrementBy = Number(req.body.incrementBy) || 1;
      const updatedMailConfig = await mailConfigurationService.incrementNumberOfMailSent(mailConfigId, incrementBy);
      res.status(200).json({
        success: true,
        message: 'Number of mails sent incremented successfully',
        data: updatedMailConfig,
      });
    } catch (error: any) {
      if (error.message === 'Mail Configuration not found') {
        res.status(404).json({
          success: false,
          message: error.message,
          data: null,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message,
          data: null,
        });
      }
    }
  }
}
