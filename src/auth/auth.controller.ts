import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import { SafeUser } from 'src/usuario/usuario.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() registerDto: registerDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: loginDto,
  ): Promise<{ message: string; user?: SafeUser }> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.senha,
    );

    if (!user) {
      return { message: 'Credenciais inválidas' };
    }

    return {
      message: 'Login bem-sucedido',
      user,
    };
  }
}
