import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateProdutoDto {
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
