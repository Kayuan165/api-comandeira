import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pedido, PedidoSchema } from './schema/pedido.schema';
import { EventEmitter } from 'stream';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pedido.name, schema: PedidoSchema }]),
  ],
  controllers: [PedidosController],
  providers: [PedidosService, EventEmitter],
  exports: [PedidosService, MongooseModule],
})
export class PedidosModule {}
