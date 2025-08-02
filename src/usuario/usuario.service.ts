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

  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
