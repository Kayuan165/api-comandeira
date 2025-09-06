import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

type MetricsServiceMock = jest.Mocked<Pick<MetricsService, 'qtdPedidos'>>;

describe('MetricsController', () => {
  let controller: MetricsController;
  let service: MetricsServiceMock;

  beforeEach(async () => {
    service = {
      qtdPedidos: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
  });

  describe('qtdPedidos', () => {
    it('should call metricsService.qtdPedidos and return its result', async () => {
      service.qtdPedidos.mockResolvedValue(10);

      const result = await controller.findAll();

      expect(service.qtdPedidos).toHaveBeenCalledTimes(1);
      expect(result).toBe(10);
    });
  });
});
