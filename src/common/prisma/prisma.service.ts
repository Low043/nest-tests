import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import type { SqlDriverAdapterFactory as DriverAdapter } from '@prisma/client/runtime/client';
import { PrismaClient } from 'src/generated/prisma/client';

export interface DbConnectionData {
  readonly adapter: DriverAdapter;
  readonly onInit?: () => Promise<void>;
  readonly onDestroy?: () => Promise<void>;
  readonly schema?: string;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly connectionData: DbConnectionData) {
    super({ adapter: connectionData.adapter });
  }

  async onModuleInit() {
    await this.$connect();
    if (this.connectionData.onInit) {
      await this.connectionData.onInit();
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    if (this.connectionData.onDestroy) {
      await this.connectionData.onDestroy();
    }
  }

  async cleanDb() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDb() is restricted to test environment');
    }

    const protocol = this.connectionData.adapter.provider;
    switch (protocol) {
      case 'postgres':
        await this.cleanPostgres(this.connectionData.schema);
        break;

      case 'mysql':
        await this.cleanMySql();
        break;

      default:
        throw new Error(`Unsupported database protocol: ${protocol}`);
    }
  }

  private async cleanPostgres(schema: string = 'public') {
    const tables = await this.$queryRawUnsafe<Array<{ tablename: string }>>(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = '${schema}' 
      AND tablename != '_prisma_migrations';
    `);

    const tableNames = tables.map((t) => `"${schema}"."${t.tablename}"`).join(', ');

    if (tableNames.length > 0) {
      await this.$executeRawUnsafe(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);
    }
  }

  private async cleanMySql() {
    const tables = await this.$queryRawUnsafe<Array<{ table_name: string }>>(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name != '_prisma_migrations';
    `);

    await this.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
    for (const table of tables) {
      await this.$executeRawUnsafe(`TRUNCATE TABLE ${table.table_name};`);
    }
    await this.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
  }
}
