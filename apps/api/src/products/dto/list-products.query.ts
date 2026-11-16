import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

/** Sorts the public catalog accepts. */
export const productSorts = ['newest', 'price_asc', 'price_desc', 'name'] as const;

/** Sort of the public catalog. */
export type ProductSort = (typeof productSorts)[number];

/** Filters for one page of approved listings. */
export class ListProductsQuery {
  /** Title search. Empty matches every title. */
  @IsOptional()
  @IsString()
  public q?: string;

  /** Tag name. Empty means every tag. */
  @IsOptional()
  @IsString()
  public tag?: string;

  /** Highest price in whole rubles. Absent when there is no ceiling. */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Цена должна быть целым числом' })
  @Min(0, { message: 'Цена не может быть меньше нуля' })
  public maxPrice?: number;

  /** Sort key. Absent means newest first. */
  @IsOptional()
  @IsIn(productSorts)
  public sort?: ProductSort;

  /** Page number, starting at 1. Absent means the first page. */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Страница должна быть целым числом' })
  @Min(1, { message: 'Страница начинается с 1' })
  public page?: number;
}
