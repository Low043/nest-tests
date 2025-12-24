import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { ILoggerService } from '../logger.interface';
import { HTTPLogDto } from '../dtos/http-log.dto';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: ILoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const status = exception.getStatus();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const defaultNestResponse = exception.getResponse();

    const resData = { statusCode: status, body: defaultNestResponse };
    const httpLogDto = HTTPLogDto.from(request, response, resData);
    this.logger.logHttpRequest(httpLogDto);

    response.status(status).json(defaultNestResponse);
  }
}
