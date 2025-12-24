import { Module } from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [LoggerModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
