import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post('create')
  create(@Body() createPedidoDto: CreatePedidoDto) {
    try {
      return this.pedidosService.create(createPedidoDto);
    } catch (error) {
      throw new BadRequestException(`Erro ao criar pedido: ${error}`);
    }
  }

  @Get('list')
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get('list:id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  @Patch('update:id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Delete('del:id')
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(+id);
  }
}
