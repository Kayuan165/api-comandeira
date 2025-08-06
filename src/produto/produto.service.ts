import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Produto } from './schema/produto.schema';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectModel(Produto.name) private productModel: Model<Produto>,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    try {
      const createProduct = await this.productModel.create({
        ...createProdutoDto,
      });
      return createProduct;
    } catch (error) {
      throw new BadRequestException(`Erro ao criar produto: ${error}`);
    }
  }

  async findAll() {
    try {
      const products = await this.productModel.find().lean().exec();

      return products;
    } catch (error) {
      throw new BadRequestException(`Erro ao buscar produtos: ${error}`);
    }
  }

  async findOne(id: string) {
    try {
      const cleanId = id.startsWith(':') ? id.substring(1) : id;

      const product = await this.productModel.findById(cleanId).lean().exec();

      if (!product) {
        throw new BadRequestException(`Produto com ID ${id} não encontrado`);
      }
      return product;
    } catch (error) {
      throw new BadRequestException(`Erro ao buscar produto por ID: ${error}`);
    }
  }

  async update(
    id: string,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    try {
      const cleanId = id.startsWith(':') ? id.substring(1) : id;

      const updatedProduct = await this.productModel
        .findByIdAndUpdate(cleanId, updateProdutoDto, { new: true })
        .lean()
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Erro ao atualizar usuário: ${error}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const cleanId = id.startsWith(':') ? id.substring(1) : id;

      const deletedProduct = await this.productModel
        .findByIdAndDelete(cleanId)
        .lean()
        .exec();

      if (!deletedProduct) {
        throw new NotFoundException('Produto não encontrado');
      }
      return { message: 'Produto removido com sucesso' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Erro ao remover produto: ${error}`,
      );
    }
  }
}
