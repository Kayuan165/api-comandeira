import { Controller, Post, Body } from '@nestjs/common';
import { AuthService, LoginResponse } from './auth.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import { SafeUser } from 'src/usuario/usuario.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() registerDto: registerDto): Promise<SafeUser> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: loginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto.email, loginDto.senha);
  }
}
