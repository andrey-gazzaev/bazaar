import { IsInt, Min } from 'class-validator';

/** How many units of one listing the cart should hold. */
export class CartQuantityDto {
  /** Units of this listing. At least one. The listing's stock is the upper bound. */
  @IsInt({ message: 'Количество должно быть целым числом' })
  @Min(1, { message: 'Количество должно быть больше нуля' })
  public quantity!: number;
}
