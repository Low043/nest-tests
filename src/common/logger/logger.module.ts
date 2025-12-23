import { Module } from '@nestjs/common';
import { ConsoleLoggerService } from './console-logger.service';
import { ILoggerService } from './logger.interface';

@Module({
  providers: [
    {
      provide: ILoggerService,
      useClass: ConsoleLoggerService, // Can be replaced with other logger implementation
    },
  ],
  exports: [ILoggerService],
})
export class LoggerModule {}
