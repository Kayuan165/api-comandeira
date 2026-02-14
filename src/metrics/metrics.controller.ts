import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('pedidos')
  findAll() {
    return this.metricsService.qtdPedidos();
  }

  @Get('valorTotal')
  findTotalValue() {
    return this.metricsService.qtdRecebida();
  }

  @Get('qtdCancelada')
  findCanceled() {
    return this.metricsService.qtdCancelada();
  }
}
