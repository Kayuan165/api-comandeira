import { Injectable } from '@nestjs/common';
import { SafeUser, UsuarioService } from 'src/usuario/usuario.service';
import { registerDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsuarioService) {}

  async register(registerDto: registerDto) {
    return this.userService.create(registerDto);
  }

  async validateUser(email: string, senha: string): Promise<SafeUser | null> {
    return this.userService.validateUser(email, senha);
  }
}
