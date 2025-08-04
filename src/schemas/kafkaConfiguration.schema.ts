import { z } from 'zod';

export const createKafkaConfigurationSchema = z.object({
  bootstrapServers: z.string().min(1, 'Bootstrap servers are required'),
  clientId: z.string().optional(),
  groupId: z.string().optional(),
  saslMechanism: z.string().optional(),
  saslUsername: z.string().optional(),
  saslPassword: z.string().optional(),
  sslRejectUnauthorized: z.boolean().optional().default(true),
  connectionTimeout: z.number().int().positive().optional(),
  retryBackoff: z.number().int().positive().optional(),
  retries: z.number().int().positive().optional(),
  enableIdempotence: z.boolean().optional().default(false),
  batchSize: z.number().int().positive().optional(),
  lingerMs: z.number().int().positive().optional(),
  bufferMemory: z.number().int().positive().optional(),
  acks: z.boolean().optional(),
});

export const updateKafkaConfigurationSchema = createKafkaConfigurationSchema.partial();

export type ICreateKafkaConfigurationInput = z.infer<typeof createKafkaConfigurationSchema>;
export type UpdateKafkaConfigurationInput = z.infer<typeof updateKafkaConfigurationSchema>;

export const kafkaConfigIdQuerySchema = z.object({
  kafkaConfigId: z.uuid(),
});
