import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  logo: z.string().optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
