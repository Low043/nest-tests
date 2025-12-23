import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ILoggerService } from './logger.interface';
import { HTTPLogDto } from './dtos/http-log.dto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: ILoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();
    const startTime = Date.now();

    return next.handle().pipe(
      tap((responseBody) => {
        const httpLogDto = HTTPLogDto.from(request, response, responseBody, startTime);
        this.logger.logHttpRequest(httpLogDto);
      }),
    );
  }
}
