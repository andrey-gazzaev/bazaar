import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/** Database client for the shop. */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /** Opens a client using DATABASE_URL. */
  public constructor() {
    super();
  }

  /** Connects when the application starts. */
  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /** Closes the connection when the application stops. */
  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
