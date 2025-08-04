import { z } from 'zod';
import { mailCredentialsTypes } from '../config/mailConf';

export const createMailConfigurationSchema = z.object({
  host: z.string().min(1),
  port: z.number().int().positive(),
  isSecured: z.boolean(),
  username: z.string().min(1),
  password: z.string().min(1),
  extraCredentials: z.record(z.string(), z.any()).optional().nullable(),
  credentialType: z.enum([mailCredentialsTypes.OAUTH2, mailCredentialsTypes.SMTP]),
  isDefaultMail: z.boolean().optional(),
});

export const updateMailConfigurationSchema = createMailConfigurationSchema.partial();

export type ICreateMailConfigurationInput = z.infer<typeof createMailConfigurationSchema>;
export type UpdateMailConfigurationInput = z.infer<typeof updateMailConfigurationSchema>;



export const mailConfigIdQuerySchema = z.object({
  mailConfigId: z.uuid(),
});