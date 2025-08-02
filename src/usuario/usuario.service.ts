import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/usuario.schema';
import { Model } from 'mongoose';
// import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {
  constructor(@InjectModel(User.name) private userSchema: Model<User>) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<User> {
    const createdUser = new this.userSchema(createUsuarioDto);
    return createdUser.save();
  }

  // async comparePassword(
  //   candidatePassword: string,
  //   hashedPassword: string,
  // ): Promise<boolean> {
  //   return bcrypt.compare(candidatePassword, hashedPassword);
  // }

  async findAll() {
    return await this.userSchema.find().exec();
  }

  async findOne(id: number) {
    return await this.userSchema.findById(id).exec();
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const cleanId = id.startsWith(':') ? id.substring(1) : id;

    const user = await this.userSchema
      .findByIdAndUpdate(cleanId, updateUsuarioDto, {
        new: true,
      })
      .exec();
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }

  async remove(id: string) {
    const cleanId = id.startsWith(':') ? id.substring(1) : id;

    const user = await this.userSchema.findByIdAndDelete(cleanId).exec();
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return { message: 'Usuário removido com sucesso' };
  }
}
