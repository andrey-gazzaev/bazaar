import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PasswordService } from '../auth/password.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/** Admin account management. */
@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, PasswordService],
})
export class UsersModule {}
