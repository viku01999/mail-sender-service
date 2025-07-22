import { AppError } from './AppError';

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service Unavailable') {
    super(message, 503);
  }
}
