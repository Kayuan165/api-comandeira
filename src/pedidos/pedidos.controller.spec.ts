import { Test, TestingModule } from '@nestjs/testing';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { getModelToken } from '@nestjs/mongoose';
import { Pedido } from './schema/pedido.schema';
import { EventEmitter } from 'stream';

describe('PedidosController', () => {
  let controller: PedidosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidosController],
      providers: [
        PedidosService,
        { provide: getModelToken(Pedido.name), useValue: {} },
        { provide: EventEmitter, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    controller = module.get<PedidosController>(PedidosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
