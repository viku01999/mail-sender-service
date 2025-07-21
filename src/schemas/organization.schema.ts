import { z } from 'zod';
import { mailConfigurationSchema } from './mailConfiguration.schema';


export const organizationSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1),
  domain: z.string().nullable(),
  logo: z.string().nullable(),
  address: z.string().nullable().default(null),
  contact: z.string().nullable().default(null),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  mailConfigurations: z.array(mailConfigurationSchema).optional(),
});

export type OrganizationSchema = z.infer<typeof organizationSchema>;
