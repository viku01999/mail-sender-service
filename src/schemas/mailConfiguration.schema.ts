import { z } from 'zod';

export const createMailConfigurationSchema = z.object({
  host: z.string().min(1),
  port: z.number().int().positive(),
  isSecured: z.boolean(),
  username: z.string().min(1),
  password: z.string().min(1),
  extraCredentials: z.record(z.string(), z.any()).optional().nullable(),
  credentialType: z.string().min(1),
});

export const updateMailConfigurationSchema = createMailConfigurationSchema.partial();

export type CreateMailConfigurationInput = z.infer<typeof createMailConfigurationSchema>;
export type UpdateMailConfigurationInput = z.infer<typeof updateMailConfigurationSchema>;
