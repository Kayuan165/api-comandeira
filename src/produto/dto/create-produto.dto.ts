import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProdutoDto {
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNotEmpty()
  @IsString()
  preco: string;

  @IsNotEmpty()
  @IsNumber()
  numero: string;

  @IsBoolean()
  ativo: boolean;
}
