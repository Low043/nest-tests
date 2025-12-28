import { Module, Global } from '@nestjs/common';
import { PrismaConfig } from './prisma.config';
import { IPrismaService } from './prisma.interface';
import { PostgresService } from './postgres.service';

@Global()
@Module({
  providers: [
    PrismaConfig,
    {
      provide: IPrismaService,
      useClass: PostgresService, // Can be replaced with other database implementation
    },
  ],
  exports: [IPrismaService],
})
export class PrismaModule {}
