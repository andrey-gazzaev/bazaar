import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { splitIds } from './split-ids';

/** Fields a seller can change. Pictures arrive as files, and the status is not one of them. */
export class UpdateProductDto {
  /** Listing title. */
  @IsString()
  @MinLength(2, { message: 'Название должно быть не короче 2 символов' })
  @MaxLength(80, { message: 'Название слишком длинное' })
  public name!: string;

  /** What the buyer should know. */
  @IsString()
  @MinLength(1, { message: 'Добавьте описание' })
  @MaxLength(2000, { message: 'Описание слишком длинное' })
  public description!: string;

  /** Price in whole rubles. */
  @Type(() => Number)
  @IsInt({ message: 'Цена должна быть целым числом' })
  @Min(1, { message: 'Цена должна быть больше нуля' })
  @Max(10_000_000, { message: 'Цена слишком большая' })
  public price!: number;

  /** Units still for sale. */
  @Type(() => Number)
  @IsInt({ message: 'Количество должно быть целым числом' })
  @Min(0, { message: 'Количество не может быть меньше нуля' })
  public stock!: number;

  /** Tag ids. A form may send them as a comma-separated string. Empty when there are no tags. */
  @Transform(({ value }: { value: unknown }) => splitIds(value))
  @IsArray()
  @IsString({ each: true })
  public tagIds: string[] = [];
}
