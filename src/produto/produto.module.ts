import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Produto, ProdutoSchema } from './schema/produto.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Produto.name, schema: ProdutoSchema }]),
  ],
  controllers: [ProdutoController],
  providers: [ProdutoService],
  exports: [ProdutoService, MongooseModule],
})
export class ProdutoModule {}
