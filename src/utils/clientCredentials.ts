import { randomBytes } from 'crypto';

export function generateClientCredentials(): { clientId: string; clientSecret: string } {
  const clientId = randomBytes(16).toString('hex');
  const clientSecret = randomBytes(32).toString('hex');
  return { clientId, clientSecret };
}
