import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // @Post('create')
  // async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<User> {
  //   return this.usuarioService.create(createUsuarioDto);
  // }

  @Get('find')
  findAll() {
    return this.usuarioService.findAll();
  }

  // @Get('find:id')
  // findOne(@Param('id') id: string) {
  //   return this.usuarioService.findOne(+id);
  // }

  @Patch('update:id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete('delete:id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }
}
