import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Produto } from 'src/produto/schema/produto.schema';
import { User } from 'src/usuario/schema/usuario.schema';

@Schema({ _id: false })
export class AdicionalItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Produto', required: true })
  produto: Types.ObjectId | Produto;

  @Prop({ required: true })
  nome: string;

  @Prop({ required: true, min: 1, default: 1 })
  quantidade: number;

  @Prop({ required: true, min: 0 })
  precoUnitario: number;

  @Prop()
  observacao: string;
}

export const AdicionalItemSchema = SchemaFactory.createForClass(AdicionalItem);

@Schema({ _id: false })
export class ItemPedido {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Produto', required: true })
  produto: Types.ObjectId | Produto;

  @Prop({ required: true, min: 1 })
  quantidade: number;

  @Prop({ required: true, min: 0 })
  precoUnitario: number;

  @Prop({ type: [AdicionalItemSchema], default: [] })
  adicionais: AdicionalItem[];

  @Prop({ required: true })
  nome: string;
}

export const ItemPedidoSchema = SchemaFactory.createForClass(ItemPedido);

@Schema({ _id: false })
export class PagamentoItem {
  @Prop({
    type: String,
    required: true,
    enum: ['dinheiro', 'pix', 'cartão crédito', 'cartão débito'],
  })
  tipo: string;

  @Prop({ required: true, min: 0 })
  valor: number;

  @Prop()
  trocoPara?: number;
}

export const PagamentoItemSchema = SchemaFactory.createForClass(PagamentoItem);

@Schema({ timestamps: true })
export class Pedido {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  usuario: Types.ObjectId | User;

  @Prop({ type: [ItemPedidoSchema], required: true })
  itens: ItemPedido[];

  @Prop({ type: [PagamentoItemSchema], required: true })
  pagamentos: PagamentoItem[];

  @Prop({ required: true, min: 0 })
  valorTotal: number;

  @Prop({ default: false })
  agendado: boolean;

  @Prop({})
  horarioAgendamento: string;

  @Prop({ default: false })
  pago: boolean;

  @Prop({ required: true })
  cliente: string;

  @Prop({})
  observacao: string;

  @Prop()
  status: boolean;
  //comer ou levar

  @Prop()
  finalizado: boolean;
}

export type PedidoDocument = HydratedDocument<Pedido>;
export const PedidoSchema = SchemaFactory.createForClass(Pedido);
