import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal Server Error';
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      message = typeof res === 'object' ? (res['message'] || res['error']) : res;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    return response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message, 
      error: exception.name || 'ServerError',
      timestamp: new Date().toISOString(),
    });
  }
}