import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PublicUser, toPublicUser } from '../common/public-user';
import { rethrowPrisma } from '../common/prisma-error';
import { PasswordService } from '../auth/password.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/** Admin list and edits of accounts. */
@Injectable()
export class UsersService {
  /** Reads accounts and hashes new passwords. */
  public constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(PasswordService) private readonly passwords: PasswordService,
  ) {}

  /** Every account, oldest first. */
  public async list(): Promise<readonly PublicUser[]> {
    const users = await this.prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
    return users.map((user) => toPublicUser(user));
  }

  /** Creates an account of any role. */
  public async create(dto: CreateUserDto): Promise<PublicUser> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email.trim().toLowerCase(),
          passwordHash: await this.passwords.hash(dto.password),
          name: dto.name.trim(),
          role: dto.role,
        },
      });

      return toPublicUser(user);
    } catch (error) {
      rethrowPrisma(error, { conflict: 'Такой email уже зарегистрирован' });
    }
  }

  /** Changes the given fields of one account. */
  public async update(userId: string, dto: UpdateUserDto): Promise<PublicUser> {
    const existing = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!existing) throw new NotFoundException('Пользователь не найден');

    if (existing.role === Role.ADMIN && dto.role && dto.role !== Role.ADMIN) {
      await this.assertAnotherAdmin(existing.id);
    }

    const data: Prisma.UserUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.email !== undefined) data.email = dto.email.trim().toLowerCase();
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.password !== undefined) data.passwordHash = await this.passwords.hash(dto.password);

    if (Object.keys(data).length === 0) throw new BadRequestException('Нет данных для обновления');

    try {
      const user = await this.prisma.user.update({ where: { id: userId }, data });
      return toPublicUser(user);
    } catch (error) {
      rethrowPrisma(error, { conflict: 'Такой email уже зарегистрирован' });
    }
  }

  /** Removes an account that is not the caller and not the last admin. */
  public async remove(actorId: string, userId: string): Promise<void> {
    if (actorId === userId) throw new BadRequestException('Нельзя удалить свою учётную запись');

    const existing = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!existing) throw new NotFoundException('Пользователь не найден');
    if (existing.role === Role.ADMIN) await this.assertAnotherAdmin(existing.id);

    await this.prisma.user.delete({ where: { id: userId } });
  }

  private async assertAnotherAdmin(userId: string): Promise<void> {
    const others = await this.prisma.user.count({
      where: { role: Role.ADMIN, NOT: { id: userId } },
    });

    if (others < 1) throw new BadRequestException('Нельзя убрать последнего админа');
  }
}
