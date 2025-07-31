import { Request, Response } from 'express';
import { NotFoundError } from '../error/NotFoundError';
import { MailSenderService } from '../service/mailSender.service';

export class MailSenderController {
  private mailSenderService: MailSenderService;

  constructor() {
    this.mailSenderService = new MailSenderService();
  }

  async sendEmailWithHeaders(req: Request, res: Response): Promise<void> {
    const clientId = req.header('clientId') || '';
    const clientSecret = req.header('clientSecret') || '';
    const mailCredentialsTypes = req.header('mailCredentialsTypes');

    // Extract toMail from query parameters
    const toMail = req.query.toMail as string | undefined;

    // Extract other fields from body and files
    const { subject, text, html } = req.body;
    // @ts-ignore
    const files = req.files;

    // Convert attachments to expected format if present
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
      res.status(500).json({ success: false, message: error.message || 'Failed to send email' });
    }
  }
}
