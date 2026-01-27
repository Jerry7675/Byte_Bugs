import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

class PrismaService {
  private client: PrismaClient;
  private adapter: PrismaPg;
  // Placeholder for websocket server or other shared resources
  public websocketServer: unknown = null;

  constructor() {
    this.adapter = adapter;
    this.client = new PrismaClient({ adapter: this.adapter });
    this.connect();
    // Disconnect on process exit
    process.on('beforeExit', () => this.disconnect());
    process.on('SIGINT', () => {
      this.disconnect().finally(() => process.exit(0));
    });
    process.on('SIGTERM', () => {
      this.disconnect().finally(() => process.exit(0));
    });
  }

  private async connect() {
    try {
      await this.client.$connect();
      console.log('[PrismaService] Connected to database');
    } catch (err) {
      console.error('[PrismaService] Connection error:', err);
    }
  }

  private async disconnect() {
    try {
      await this.client.$disconnect();
      console.log('[PrismaService] Disconnected from database');
    } catch (err) {
      console.error('[PrismaService] Disconnection error:', err);
    }
  }

  getClient() {
    return this.client;
  }

  getAdapter() {
    return this.adapter;
  }

  // Future: set up websocket server here
  setWebSocketServer(server: unknown) {
    this.websocketServer = server;
  }
  getWebSocketServer(): unknown {
    return this.websocketServer;
  }
}

export const prismaService = new PrismaService();
