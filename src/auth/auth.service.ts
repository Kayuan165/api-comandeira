import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SafeUser, UsuarioService } from 'src/usuario/usuario.service';
import { registerDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsuarioService) {}

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
}
