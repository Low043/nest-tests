import { Module } from '@nestjs/common';
import { ValidationModule } from './common/validation/validation.module';
import { LoggerModule } from './common/logger/logger.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [LoggerModule, ValidationModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
