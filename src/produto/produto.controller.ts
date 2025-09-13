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
  async create(@Body() createProdutoDto: CreateProdutoDto) {
    try {
      return await this.produtoService.create(createProdutoDto);
    } catch (error) {
      throw new BadRequestException(`Erro ao criar produto: ${error}`);
    }
  }

  @Get('list')
  async findAll() {
    return await this.produtoService.findAll();
  }

  @Get('list/:id')
  async findOne(@Param('id') id: string) {
    return await this.produtoService.findOne(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ) {
    return await this.produtoService.update(id, updateProdutoDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.produtoService.remove(id);
  }
}
