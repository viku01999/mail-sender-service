import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../error/NotFoundError';
import { MailSenderService } from '../service/mailSender.service';

export class MailSenderController {
  private mailSenderService: MailSenderService;

  constructor() {
    this.mailSenderService = new MailSenderService();
  }

  async sendEmailWithHeaders(req: Request, res: Response, next: NextFunction): Promise<void> {
    const clientId = req.header('clientId') || '';
    const clientSecret = req.header('clientSecret') || '';

    if (!clientId || !clientSecret) {
      throw new NotFoundError('Client ID and Client Secret are required');
    }

    const toMail = req.query.toMail as string | undefined;

    const { subject, text, html } = req.body;
    const files = req.files;

    let attachments;
    if (files && Array.isArray(files) && files.length > 0) {
      attachments = files.map((file: any) => ({
        filename: file.originalname,
        content: file.buffer,
      }));
    } else {
      attachments = undefined;
    }

    try {
      await this.mailSenderService.sendEmailWithClientCredentials(clientId, clientSecret, toMail || '', subject, text, html, attachments);
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error: any) {
      console.error(`[CONTROLLER ERROR] Error in sendEmailWithHeaders:`, error);
      next(error);
    }
  }
}
