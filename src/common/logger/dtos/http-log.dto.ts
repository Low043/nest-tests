import { Request, Response } from 'express';

type ResponseData = { statusCode: number; body: any };

export class HTTPLogDto {
  readonly ip: string;
  readonly method: string;
  readonly originalUrl: string;
  readonly durationMs: number;
  readonly statusCode: number;
  readonly requestBody?: any;
  readonly responseBody?: any;

  private constructor(partial: Partial<HTTPLogDto>) {
    Object.assign(this, partial);
  }

  static from(req: Request, res: Response, resData: ResponseData): HTTPLogDto {
    const duration = Date.now() - (res.locals.requestTimestamp || Date.now());

    return new HTTPLogDto({
      ip: req.ip?.replace('::ffff:', '') || 'unknown',
      method: req.method,
      originalUrl: req.originalUrl,
      requestBody: req.body,
      durationMs: duration,
      statusCode: resData.statusCode,
      responseBody: resData.body,
    });
  }
}
