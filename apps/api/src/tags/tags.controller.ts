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
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TagNameDto } from './dto/tag-name.dto';
import { TagDto } from './tag.dto';
import { TagsService } from './tags.service';

/** Tag catalog. Listing is public; changes are for an admin. */
@Controller('tags')
export class TagsController {
  /** Reads and changes tags. */
  public constructor(@Inject(TagsService) private readonly tags: TagsService) {}

  /** Every tag. */
  @Get()
  public async list(): Promise<{ tags: readonly TagDto[] }> {
    return { tags: await this.tags.list() };
  }

  /** Adds a tag. */
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  public async create(@Body() dto: TagNameDto): Promise<{ tag: TagDto }> {
    return { tag: await this.tags.create(dto) };
  }

  /** Renames a tag. */
  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  public async update(@Param('id') id: string, @Body() dto: TagNameDto): Promise<{ tag: TagDto }> {
    return { tag: await this.tags.update(id, dto) };
  }

  /** Removes a tag. */
  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: string): Promise<void> {
    await this.tags.remove(id);
  }
}
