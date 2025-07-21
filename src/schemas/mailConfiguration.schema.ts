import { z } from 'zod';

export const mailConfigurationSchema = z.object({
  mailConfigId: z.string().uuid(),
  host: z.string().min(1),
  port: z.number(),
  isSecured: z.boolean(),
  username: z.string(),
  password: z.string(),
  extraCredentials: z.record(z.string(), z.any()).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  credentialType: z.string(),
}).refine((data) => {
  return (
    (data.isSecured === true && data.port === 465) ||
    (data.isSecured === false && data.port === 587)
  );
}, {
  message: 'Port must be 465 if isSecured is true, or 587 if isSecured is false.',
  path: ['port'],
});
