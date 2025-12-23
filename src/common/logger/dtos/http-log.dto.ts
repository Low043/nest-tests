import { Request, Response } from 'express';

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

  static from(req: Request, res: Response, resBody: any, startTime: number): HTTPLogDto {
    const endTime = Date.now();

    return new HTTPLogDto({
      ip: req.ip?.replace('::ffff:', '') || 'unknown',
      method: req.method,
      originalUrl: req.originalUrl,
      durationMs: endTime - startTime,
      statusCode: res.statusCode,
      requestBody: req.body,
      responseBody: resBody,
    });
  }
}
