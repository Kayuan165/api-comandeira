import {
  IsArray,
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateAdicionalItemDto {
  @IsMongoId()
  @IsNotEmpty()
  produto: string;

  @IsNumber()
  @Min(1)
  quantidade: number;

  @IsNumber()
  @Min(0)
  precoUnitario: number;

  @IsString()
  @IsOptional()
  observacao?: string;

  @IsString()
  @IsNotEmpty()
  nome: string;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAdicionalItemDto)
  @IsOptional()
  adicionais?: CreateAdicionalItemDto[];

  @IsString()
  @IsNotEmpty()
  nome: string;
}

class PagamentoItemDto {
  @IsString()
  @IsIn(['dinheiro', 'pix', 'cartão crédito', 'cartão débito', 'vale refeição'])
  tipo: string;

  @IsNumber()
  @Min(0)
  valor: number;

  @IsOptional()
  @IsNumber()
  trocoPara?: number;

  @IsOptional()
  @IsString()
  @Length(4, 4)
  ultimosDigitos?: string;
}

export class CreatePedidoDto {
  @IsMongoId()
  @IsNotEmpty()
  usuario: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemPedidoDto)
  itens: CreateItemPedidoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PagamentoItemDto)
  pagamentos: PagamentoItemDto[];

  @IsNumber()
  @Min(0)
  valorTotal: number;

  @IsBoolean()
  @IsOptional()
  agendado?: boolean;

  @IsString()
  @IsOptional()
  horarioAgendamento?: string;

  @IsOptional()
  @IsBoolean()
  pago?: boolean;

  @IsString()
  @IsNotEmpty()
  cliente: string;

  @IsString()
  @IsOptional()
  observacao?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsBoolean()
  @IsOptional()
  finalizado?: boolean;
}
