import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/** Shared database client. */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
