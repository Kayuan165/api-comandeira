import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pedido } from './schema/pedido.schema';
import { Model } from 'mongoose';
import { EventEmitter } from 'stream';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<Pedido>,
    private eventEmitter: EventEmitter,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    try {
      if (!createPedidoDto.itens?.length) {
        throw new Error('Pedido deve conter pelo menos um item');
      }

      if (createPedidoDto.valorTotal <= 0) {
        throw new BadRequestException(
          'Valor total do pedido deve ser maior que zero',
        );
      }

      if (!createPedidoDto.agendado && createPedidoDto.horarioAgendamento) {
        throw new BadRequestException(
          'Horário de agendamento só pode ser definido se o pedido for agendado',
        );
      }

      if (!createPedidoDto.pago && createPedidoDto.pagamentos?.length > 0) {
        throw new BadRequestException(
          'Pedido não pode ter pagamentos se não estiver pago',
        );
      }

      if (
        createPedidoDto.pago &&
        (!createPedidoDto.pagamentos || createPedidoDto.pagamentos.length === 0)
      ) {
        throw new BadRequestException(
          'Pedido marcado como pago deve conter pelo menos uma forma de pagamento',
        );
      }

      const pedido = await this.pedidoModel.create({ ...createPedidoDto });
      this.eventEmitter.emit('pedido.criado', pedido);

      if (!pedido) {
        throw new Error('Erro ao criar pedido');
      }
      return pedido;
    } catch (error) {
      throw new Error(`Erro ao criar pedido: ${error}`);
    }
  }

  async findAll() {
    try {
      const pedidos = await this.pedidoModel.find().lean().exec();
      return pedidos;
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos: ${error}`);
    }
  }

  async findOne(id: number) {
    try {
      const pedido = await this.pedidoModel.findById(id).lean().exec();
      if (!pedido) {
        throw new Error(`Pedido com ID ${id} não encontrado`);
      }
      return pedido;
    } catch (error) {
      throw new Error(`Erro ao buscar pedido por ID: ${error}`);
    }
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    try {
      const pedido = await this.pedidoModel
        .findByIdAndUpdate(id, updatePedidoDto, { new: true })
        .lean()
        .exec();
      if (!pedido) {
        throw new Error(`Pedido com ID ${id} não encontrado`);
      }
      return pedido;
    } catch (error) {
      throw new Error(`Erro ao atualizar pedido: ${error}`);
    }
  }

  async remove(id: number) {
    try {
      const pedido = await this.pedidoModel.findByIdAndDelete(id).exec();
      if (!pedido) {
        throw new Error(`Pedido com ID ${id} não encontrado`);
      }
      return pedido;
    } catch (error) {
      throw new Error(`Erro ao remover pedido: ${error}`);
    }
  }
}
