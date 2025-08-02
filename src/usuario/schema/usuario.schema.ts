import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import * as bcrypt from 'bcrypt';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret: { _id?: any; __v?: any; senha?: string }) => {
      delete ret._id;
      delete ret.__v;
      delete ret.senha;
      return ret;
    },
  },
})
export class User extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  senha: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(User);

UsuarioSchema.index({ email: 1 }, { unique: true });

// UsuarioSchema.pre<User>('save', async function (next) {
//   if (!this.isModified('senha')) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.senha = await bcrypt.hash(this.senha, salt);
//   } catch (err) {
//     next(err);
//   }
// });

// UsuarioSchema.methods.comparePassword = async function (
//   candidatePassword: string,
//   senha: string,
// ): Promise<boolean> {
//   return bcrypt.compare(candidatePassword, senha);
// };
