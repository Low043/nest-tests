import { ZodValidationPipe } from 'nestjs-zod';
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ]
})
export class ValidationModule {}
