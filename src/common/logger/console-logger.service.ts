import { Injectable, Logger } from '@nestjs/common';
import { HTTPLogDto } from './dtos/http-log.dto';
import { ILoggerService } from './logger.interface';

@Injectable()
export class ConsoleLoggerService implements ILoggerService {
  private readonly logger = new Logger(ConsoleLoggerService.name);

  logHttpRequest(data: HTTPLogDto): void {
    const { ip, method, originalUrl, durationMs, statusCode } = data;

    this.logger.debug('----------------------------------');
    this.logger.debug(`[${ip}] ${method} ${originalUrl} (${durationMs}ms)`);

    if (data.requestBody) {
      this.logger.debug(`received: ${JSON.stringify(data.requestBody)}`);
    }

    if (data.responseBody) {
      this.logger.debug(`sent [${statusCode}]: ${JSON.stringify(data.responseBody)}`);
    }
  }
}
