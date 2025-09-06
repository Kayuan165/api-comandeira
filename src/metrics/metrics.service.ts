import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pedido } from '../pedidos/schema/pedido.schema';

@Injectable()
export class MetricsService {
  constructor(@InjectModel(Pedido.name) private pedidoModel: Model<Pedido>) {}

  async qtdPedidos() {
    try {
      const hoje = new Date();
      const inicioDoDia = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate(),
      );
      const fimDoDia = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate() + 1,
      );

      return await this.pedidoModel.countDocuments({
        createdAt: { $gte: inicioDoDia, $lt: fimDoDia },
      });
    } catch (err) {
      throw new BadRequestException(`Erro ao buscar pedidos do dia: ${err}`);
    }
  }
}
