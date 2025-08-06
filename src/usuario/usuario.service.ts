import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schema/usuario.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

export type UserDocument = User & {
  createdAt?: Date;
  updatedAt?: Date;
};

export type SafeUser = Omit<UserDocument, 'senha' | 'save' | 'toObject'> & {
  _id: string;
};

@Injectable()
export class UsuarioService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, 10);

    const createdUser = await this.userModel.create({
      ...createUsuarioDto,
      senha: hashedPassword,
    });

    return this.toSafeUser(createdUser);
  }

  async validateUser(email: string, senha: string): Promise<SafeUser | null> {
    const user = await this.userModel
      .findOne({ email })
      .select('+senha')
      .lean()
      .exec();

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) return null;

    return this.toSafeUser(user);
  }

  private toSafeUser(user: Record<string, any>): SafeUser {
    const { ...rest } = user;

    return rest as SafeUser;
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userModel.find().lean().exec();
    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(id: string): Promise<SafeUser | null> {
    const cleanId = id.startsWith(':') ? id.substring(1) : id;
    const user = await this.userModel.findById(cleanId).lean().exec();
    return user ? this.toSafeUser(user) : null;
  }

  async findOneByEmail(email: string): Promise<SafeUser | null> {
    const user = await this.userModel
      .findOne({ email })
      .select('+senha')
      .lean()
      .exec();
    return user ? this.toSafeUser(user) : null;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<SafeUser> {
    const cleanId = id.startsWith(':') ? id.substring(1) : id;

    const updatedUser = await this.userModel
      .findByIdAndUpdate(cleanId, updateUsuarioDto, { new: true })
      .lean()
      .exec();

    if (!updatedUser) {
      throw new Error('Usuário não encontrado');
    }

    return this.toSafeUser(updatedUser);
  }

  async remove(id: string): Promise<{ message: string }> {
    const cleanId = id.startsWith(':') ? id.substring(1) : id;
    const result = await this.userModel.findByIdAndDelete(cleanId).exec();

    if (!result) {
      throw new Error('Usuário não encontrado');
    }

    return { message: 'Usuário removido com sucesso' };
  }
}
