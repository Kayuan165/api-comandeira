import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('product')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post('create')
  create(@Body() createProdutoDto: CreateProdutoDto) {
    try {
      return this.produtoService.create(createProdutoDto);
    } catch (error) {
      throw new BadRequestException(`Erro ao criar produto: ${error}`);
    }
  }

  @Get('list')
  findAll() {
    return this.produtoService.findAll();
  }

  @Get('list/:id')
  findOne(@Param('id') id: string) {
    return this.produtoService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtoService.update(id, updateProdutoDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.produtoService.remove(id);
  }
}
