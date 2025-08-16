import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret: { __v?: any; senha?: string }) => {
      delete ret.__v;
      delete ret.senha;
      return ret;
    },
  },
})
export class Produto {
  @Prop({ required: true })
  descricao: string;

  @Prop({ required: true })
  preco: number;

  @Prop({ required: true, select: false })
  numero: number;

  @Prop({ default: true })
  ativo: boolean;

  @Prop({ default: false })
  adicional: boolean;
}

export const ProdutoSchema = SchemaFactory.createForClass(Produto);
