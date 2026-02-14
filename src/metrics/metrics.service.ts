import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Promise } from 'mongoose';
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

  async qtdRecebida(): Promise<number> {
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

      const resultado = await this.pedidoModel.aggregate<{
        totalRecebido: number;
      }>([
        {
          $match: {
            createdAt: { $gte: inicioDoDia, $lt: fimDoDia },
            finalizado: true,
          },
        },
        {
          $group: {
            _id: null,
            totalRecebido: { $sum: '$valorTotal' },
          },
        },
      ]);

      return resultado.length > 0 ? resultado[0].totalRecebido : 0;
    } catch (err) {
      throw new BadRequestException(`Erro ao buscar valor recebido: ${err}`);
    }
  }

  async qtdCancelada(): Promise<number> {
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
        finalizado: false,
      });
    } catch (err) {
      throw new BadRequestException(
        `Erro ao buscar pedidos cancelados: ${err}`,
      );
    }
  }
}
