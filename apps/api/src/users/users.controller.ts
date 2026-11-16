import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PublicUser } from '../common/public-user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

/** Admin accounts. */
@Controller('users')
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  /** Reads and changes accounts. */
  public constructor(@Inject(UsersService) private readonly users: UsersService) {}

  /** Every account. */
  @Get()
  public async list(): Promise<{ users: readonly PublicUser[] }> {
    return { users: await this.users.list() };
  }

  /** Creates an account of any role. */
  @Post()
  public async create(@Body() dto: CreateUserDto): Promise<{ user: PublicUser }> {
    return { user: await this.users.create(dto) };
  }

  /** Changes one account. */
  @Patch(':id')
  public async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<{ user: PublicUser }> {
    return { user: await this.users.update(id, dto) };
  }

  /** Removes an account other than the caller. */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@CurrentUser() actor: PublicUser, @Param('id') id: string): Promise<void> {
    await this.users.remove(actor.id, id);
  }
}
