import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

export abstract class IPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  abstract onModuleInit(): Promise<void>;
  abstract onModuleDestroy(): Promise<void>;
}
