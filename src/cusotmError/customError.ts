import { HttpError } from 'routing-controllers';

export class customError extends HttpError {
  constructor(operationStatus: number, operationMessage: string) {
    super(operationStatus, operationMessage);
  }
}
