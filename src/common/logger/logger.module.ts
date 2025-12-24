import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LoggerInterceptor } from './logger.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { RequestTimestampMiddleware } from './middlewares/request-timestamp.middleware';
import { ConsoleLoggerService } from './console-logger.service';
import { ILoggerService } from './logger.interface';

@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    {
      provide: ILoggerService,
      useClass: ConsoleLoggerService, // Can be replaced with other logger implementation
    },
  ],
  exports: [ILoggerService],
})
export class LoggerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestTimestampMiddleware).forRoutes('*');
  }
}
