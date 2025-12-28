import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaConfig {
  getDatabaseUrl(): string {
    const url = process.env.DATABASE_URL;

    if (!url) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    return url;
  }
}
