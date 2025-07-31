import { Request, Response } from 'express';
import { AppError } from '../error/AppError';
import { CreateOrganizationInput, createOrganizationSchema, organizationIdQuerySchema, UpdateOrganizationInput, updateOrganizationSchema } from '../schemas/organization.schema';
import { OrganizationService } from '../service/organization.service';


const organizationService = new OrganizationService();


export class OrganizationController {
  async createOrganization(req: Request<{}, {}, CreateOrganizationInput>, res: Response): Promise<void> {
    const parseResult = createOrganizationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        data: parseResult.error.issues,
      });
      return;
    }
    try {
      const organization = await organizationService.createOrganization(parseResult.data);
      res.status(201).json({
        success: true,
        message: "Organization created successfully. Dont't share your client id and secret with anyone.",
        data: organization,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async getOrganizationDetails(req: Request, res: Response): Promise<void> {
    try {
      const organizations = await organizationService.getOrganizationDetails();
      res.status(200).json({
        success: true,
        data: organizations,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getOrganizationById(req: Request<{}, {}, {}, { organizationId: string }>, res: Response): Promise<void> {
    try {
      const queryValidation = organizationIdQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameter',
          data: queryValidation.error.issues,
        });
        return;
      }
      const { organizationId } = queryValidation.data;
      const organization = await organizationService.getOrganizationById(organizationId);
      if (!organization) {
        res.status(404).json({
          success: false,
          message: 'Organization not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: organization,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateOrganization(req: Request<{}, {}, UpdateOrganizationInput, { organizationId: string }>, res: Response): Promise<void> {
    const parseResult = updateOrganizationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        data: parseResult.error.issues,
      });
      return;
    }
    try {
      const queryValidation = organizationIdQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameter',
          data: queryValidation.error.issues,
        });
        return;
      }
      const { organizationId } = queryValidation.data;
      const updatedOrganization = await organizationService.updateOrganization(organizationId, parseResult.data);
      res.status(200).json({
        success: true,
        message: 'Organization updated successfully',
        data: updatedOrganization,
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

  async deleteOrganization(req: Request<{}, {}, {}, { organizationId: string }>, res: Response): Promise<void> {
    try {
      const queryValidation = organizationIdQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameter',
          data: queryValidation.error.issues,
        });
        return;
      }
      const { organizationId } = queryValidation.data;
      await organizationService.deleteOrganization(organizationId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
