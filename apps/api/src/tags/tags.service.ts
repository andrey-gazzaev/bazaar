import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { rethrowPrisma } from '../common/prisma-error';
import { PrismaService } from '../prisma/prisma.service';
import { TagNameDto } from './dto/tag-name.dto';
import { TagDto, toTag } from './tag.dto';

/** Tag catalog used by listings and the admin screen. */
@Injectable()
export class TagsService {
  /** Reads and writes tags. */
  public constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** Every tag, by name. */
  public async list(): Promise<readonly TagDto[]> {
    const tags = await this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
    return tags.map((tag) => toTag(tag));
  }

  /** Adds a tag with a unique name. */
  public async create(dto: TagNameDto): Promise<TagDto> {
    const name = this.cleanName(dto.name);

    try {
      const tag = await this.prisma.tag.create({ data: { name } });
      return toTag(tag);
    } catch (error) {
      rethrowPrisma(error, { conflict: 'Такой тег уже есть' });
    }
  }

  /** Renames a tag. */
  public async update(id: string, dto: TagNameDto): Promise<TagDto> {
    const name = this.cleanName(dto.name);

    try {
      const tag = await this.prisma.tag.update({ where: { id }, data: { name } });
      return toTag(tag);
    } catch (error) {
      rethrowPrisma(error, { conflict: 'Такой тег уже есть', missing: 'Тег не найден' });
    }
  }

  /** Removes a tag and detaches it from listings. */
  public async remove(id: string): Promise<void> {
    try {
      await this.prisma.tag.delete({ where: { id } });
    } catch (error) {
      rethrowPrisma(error, { missing: 'Тег не найден' });
    }
  }

  private cleanName(name: string): string {
    const trimmed = name.trim();

    if (trimmed.length < 2) throw new BadRequestException('Название тега должно быть не короче 2 символов');

    return trimmed;
  }
}
