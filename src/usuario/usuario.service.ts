import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, 10);

      const createdUser = await this.userModel.create({
        ...createUsuarioDto,
        senha: hashedPassword,
      });

      return this.toSafeUser(createdUser);
    } catch (error) {
      throw new BadRequestException(`Erro ao criar usuário: ${error}`);
    }
  }

  async validateUser(email: string, senha: string): Promise<SafeUser | null> {
    try {
      const user = await this.userModel
        .findOne({ email })
        .select('+senha')
        .lean()
        .exec();

      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (!isPasswordValid) return null;

      return this.toSafeUser(user);
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao validar usuário: ${error}`,
      );
    }
  }

  private toSafeUser(user: Record<string, any>): SafeUser {
    const { ...rest } = user;
    return rest as SafeUser;
  }

  async findAll(): Promise<SafeUser[]> {
    try {
      const users = await this.userModel.find().lean().exec();
      return users.map((user) => this.toSafeUser(user));
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao buscar usuários: ${error}`,
      );
    }
  }

  async findOne(id: string): Promise<SafeUser | null> {
    try {
      const cleanId = id.startsWith(':') ? id.substring(1) : id;
      const user = await this.userModel.findById(cleanId).lean().exec();

      return user ? this.toSafeUser(user) : null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao buscar usuário por ID: ${error}`,
      );
    }
  }

  async findOneByEmail(email: string): Promise<SafeUser | null> {
    try {
      const user = await this.userModel
        .findOne({ email })
        .select('+senha')
        .lean()
        .exec();

      return user ? this.toSafeUser(user) : null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao buscar usuário por e-mail: ${error}`,
      );
    }
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<SafeUser> {
    try {
      const cleanId = id.startsWith(':') ? id.substring(1) : id;

      const updatedUser = await this.userModel
        .findByIdAndUpdate(cleanId, updateUsuarioDto, { new: true })
        .lean()
        .exec();

      if (!updatedUser) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return this.toSafeUser(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Erro ao atualizar usuário: ${error}`,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const cleanId = id.startsWith(':') ? id.substring(1) : id;
      const result = await this.userModel.findByIdAndDelete(cleanId).exec();

      if (!result) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return { message: 'Usuário removido com sucesso' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Erro ao remover usuário: ${error}`,
      );
    }
  }
}
