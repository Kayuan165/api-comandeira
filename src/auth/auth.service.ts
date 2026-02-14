import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SafeUser, UsuarioService } from 'src/usuario/usuario.service';
import { registerDto } from './dto/register.dto';

export interface LoginResponse {
  access_token: string;
  user: SafeUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: registerDto): Promise<SafeUser> {
    try {
      return await this.userService.create(registerDto);
    } catch (error) {
      throw new BadRequestException(`Erro ao registrar usuário: ${error}`);
    }
  }

  async validateUser(email: string, senha: string): Promise<SafeUser> {
    try {
      const user = await this.userService.validateUser(email, senha);

      if (!user) {
        throw new UnauthorizedException('E-mail ou senha inválidos');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException(
        `Erro ao validar usuário: ${error}`,
      );
    }
  }

  async login(email: string, senha: string): Promise<LoginResponse> {
    const user = await this.validateUser(email, senha);

    const payload = {
      sub: user._id,
      email: user.email,
      nome: user.nome,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
