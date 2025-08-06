import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateItemPedidoDto {
  @IsMongoId()
  @IsNotEmpty()
  produto: string;

  @IsNumber()
  @Min(1)
  quantidade: number;

  @IsNumber()
  @Min(0)
  precoUnitario: number;
}

export class CreatePedidoDto {
  @IsMongoId()
  @IsNotEmpty()
  usuario: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemPedidoDto)
  itens: CreateItemPedidoDto[];

  @IsNumber()
  @Min(0)
  valorTotal: number;

  @IsBoolean()
  agendado: boolean;

  @IsBoolean()
  pago: boolean;

  @IsString()
  @IsOptional()
  observacao?: string;
}
