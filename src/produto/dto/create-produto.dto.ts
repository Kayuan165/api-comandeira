import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProdutoDto {
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNotEmpty()
  @IsString()
  preco: number;

  @IsNotEmpty()
  @IsNumber()
  numero: string;

  @IsBoolean()
  ativo: boolean;

  @IsBoolean()
  @IsOptional()
  adicional?: boolean;
}
