import { HTTPLogDto } from './dtos/http-log.dto';

export abstract class ILoggerService {
  abstract logHttpRequest(data: HTTPLogDto): void;
}
