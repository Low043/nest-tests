import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from './common/logger/logger.module';
import { LoggerInterceptor } from './common/logger/logger.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [LoggerModule, UserModule],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
    AppService,
  ],
})
export class AppModule {}
