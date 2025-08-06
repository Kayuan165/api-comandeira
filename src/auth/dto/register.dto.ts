import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class registerDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  senha: string;

  @IsString()
  @IsNotEmpty()
  nome: string;
}
