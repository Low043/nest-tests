import { Injectable } from '@nestjs/common';
import { PrismaConfig } from './prisma.config';
import { IPrismaService } from './prisma.interface';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PostgresService extends IPrismaService {
  private pool: Pool;

  constructor(prismaConfig: PrismaConfig) {
    const connectionString = prismaConfig.getDatabaseUrl();

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
