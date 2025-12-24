import { Injectable, Logger } from '@nestjs/common';
import { HTTPLogDto } from './dtos/http-log.dto';
import { ILoggerService } from './logger.interface';

@Injectable()
export class ConsoleLoggerService implements ILoggerService {
  private readonly logger = new Logger(ConsoleLoggerService.name);
  private readonly separator = '----------------------------------';

  logHttpRequest(data: HTTPLogDto): void {
    const { ip, method, originalUrl, durationMs, statusCode } = data;
    let logLines: string[] = [''];

    logLines.push(`[${ip}] ${method} ${originalUrl} (${durationMs}ms)`);

    if (data.requestBody) {
      logLines.push(`received: ${JSON.stringify(data.requestBody)}`);
    }

    if (data.responseBody) {
      logLines.push(`sent [${statusCode}]: ${JSON.stringify(data.responseBody)}`);
    }

    logLines.push(this.separator);
    this.logger.debug(logLines.join('\n'));
  }
}
