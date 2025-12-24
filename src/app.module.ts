import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { RequestTimestampMiddleware } from './common/middlewares/request-timestamp.middleware';
import { LoggerModule } from './common/logger/logger.module';
import { LoggerInterceptor } from './common/logger/logger.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [LoggerModule, UserModule],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestTimestampMiddleware).forRoutes('*');
  }
}
