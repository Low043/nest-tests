import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RequestTimestampMiddleware {
  use(req: Request, res: Response, next: () => void) {
    res.locals.requestTimestamp = Date.now();
    next();
  }
}