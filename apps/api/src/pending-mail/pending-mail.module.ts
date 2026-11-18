import { Module } from '@nestjs/common';
import { PendingMail } from './pending-mail';

/** Mail when a listing becomes pending. */
@Module({
  providers: [PendingMail],
  exports: [PendingMail],
})
export class PendingMailModule {}
