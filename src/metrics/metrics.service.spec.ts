import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Pedido } from '../pedidos/schema/pedido.schema';

describe('MetricsService', () => {
  let service: MetricsService;

  const mockPedidoModel = {
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        { provide: getModelToken(Pedido.name), useValue: mockPedidoModel },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);

    jest.clearAllMocks();
  });

  it('should counting total pedidos', async () => {
    mockPedidoModel.countDocuments.mockResolvedValue(5);

    const result = await service.qtdPedidos();

    expect(result).toBe(5);
    expect(mockPedidoModel.countDocuments).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when counting pedidos', async () => {
    mockPedidoModel.countDocuments.mockRejectedValue(new Error('DB error'));

    await expect(service.qtdPedidos()).rejects.toThrow(BadRequestException);
    expect(mockPedidoModel.countDocuments).toHaveBeenCalledTimes(1);
  });
});
