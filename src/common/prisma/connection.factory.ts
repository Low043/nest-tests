import type { DbConnectionData } from './prisma.service';
import { PrismaConfig } from './prisma.config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

export class PrismaConnectionFactory {
  static create(config: PrismaConfig): DbConnectionData {
    const protocol = config.getDatabaseProtocol();

    switch (protocol) {
      case 'postgresql':
        return this.getPostgresConnection(config);

      case 'mysql':
        return this.getMariaDbConnection(config);

      default:
        throw new Error(`Unsupported database protocol: ${protocol}`);
    }
  }

  private static getPostgresConnection(config: PrismaConfig): DbConnectionData {
    const connectionString = config.getDatabaseUrl();
    const schema = config.getDatabaseSchema();

    return { adapter: new PrismaPg({ connectionString }, { schema }), schema };
  }

  private static getMariaDbConnection(config: PrismaConfig): DbConnectionData {
    const connectionString = config.getDatabaseUrl() + '?allowPublicKeyRetrieval=true';

    return { adapter: new PrismaMariaDb(connectionString) };
  }
}
