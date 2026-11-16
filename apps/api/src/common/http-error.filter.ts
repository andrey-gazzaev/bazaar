import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { MulterError } from 'multer';

/** Writes API errors as `{ message, statusCode }`. */
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  /** Sends one string message the shop can show. */
  public catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof MulterError) {
      const message = exception.code === 'LIMIT_FILE_SIZE' ? 'Картинка больше 5 МБ' : 'Не удалось принять картинку';
      response.status(HttpStatus.BAD_REQUEST).json({ message, statusCode: HttpStatus.BAD_REQUEST });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const raw = typeof body === 'string' ? body : (body as { message?: string | string[] }).message;
      const message = Array.isArray(raw) ? raw.join(', ') : (raw ?? 'Запрос не удался');
      response.status(status).json({ message, statusCode: status });
      return;
    }

    console.error(exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Запрос не удался',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
