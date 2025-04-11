import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsNumberString(
    { no_symbols: true },
    { message: 'must be a number without any symbols' },
  )
  @MinLength(7)
  @MaxLength(8)
  dni: string;
}
