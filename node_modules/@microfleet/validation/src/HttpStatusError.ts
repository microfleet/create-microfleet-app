import { HttpStatusError as HttpCoreError } from 'common-errors';

export class HttpStatusError extends HttpCoreError {
  public errors?: Error[];
  public field?: string;
  public status?: number;
  public status_code?: number; // tslint:disable-line:variable-name

  /**
   * @param statusCode
   * @param message
   * @param field
   */
  constructor(statusCode: number, message?: string, field?: string) {
    super(statusCode, message);
    this.field = field;
  }

  /**
   * Adds error to the http status
   */
  public addError(error: Error) {
    this.errors = this.errors || [];
    this.errors.push(error);
    return this;
  }
}
