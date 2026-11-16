import { IsString, MaxLength, MinLength } from 'class-validator';

/** Delivery details for a mock purchase of the cart. */
export class CreateOrderDto {
  /** Person who receives the parcel. */
  @IsString()
  @MinLength(2, { message: 'Укажите, кому доставить' })
  @MaxLength(80, { message: 'Имя получателя слишком длинное' })
  public recipientName!: string;

  /** Phone for the courier. */
  @IsString()
  @MinLength(5, { message: 'Укажите телефон' })
  @MaxLength(30, { message: 'Телефон слишком длинный' })
  public phone!: string;

  /** Where to deliver. */
  @IsString()
  @MinLength(5, { message: 'Укажите адрес' })
  @MaxLength(200, { message: 'Адрес слишком длинный' })
  public address!: string;
}
