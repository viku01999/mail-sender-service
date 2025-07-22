import { AppError } from './AppError';

export class UnprocessableEntityError extends AppError {
  constructor(message = 'Unprocessable Entity') {
    super(message, 422);
  }
}
