import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateProdutoDto {
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
  adicional: boolean;
}
