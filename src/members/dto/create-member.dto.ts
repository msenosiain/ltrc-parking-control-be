import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  lastName: string;

  @IsNotEmpty()
  @IsNumberString(
    { no_symbols: true },
    { message: 'must be a number without any symbols' },
  )
  @MinLength(7)
  @MaxLength(8)
  @Transform(({ value }) => value?.toString().replace(/\./g, ''))
  dni: string;
}
