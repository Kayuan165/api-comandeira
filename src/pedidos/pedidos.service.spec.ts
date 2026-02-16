import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { getModelToken } from '@nestjs/mongoose';
import { Pedido } from './schema/pedido.schema';
import { EventEmitter } from 'stream';
import { InternalServerErrorException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

type MockPedidoModel = {
  create: jest.Mock;
  find: jest.Mock;
  findById: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  findByIdAndDelete: jest.Mock;
};

type MockEventEmitter = {
  emit: jest.Mock;
};

describe('PedidosService', () => {
  let service: PedidosService;
  let mockPedidoModel: MockPedidoModel;
  let mockEventEmitter: MockEventEmitter;

  const mockPedido = {
    _id: '507f1f77bcf86cd799439011',
    usuario: '507f1f77bcf86cd799439012',
    itens: [
      {
        produto: '507f1f77bcf86cd799439013',
        quantidade: 2,
        precoUnitario: 25.5,
        nome: 'Hambúrguer',
        adicionais: [],
      },
    ],
    pagamentos: [
      {
        tipo: 'pix',
        valor: 51.0,
      },
    ],
    valorTotal: 51.0,
    agendado: false,
    pago: true,
    cliente: 'João Silva',
    observacao: 'Sem cebola',
    status: true,
    finalizado: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreatePedidoDto: CreatePedidoDto = {
    usuario: '507f1f77bcf86cd799439012',
    itens: [
      {
        produto: '507f1f77bcf86cd799439013',
        quantidade: 2,
        precoUnitario: 25.5,
        nome: 'Hambúrguer',
      },
    ],
    pagamentos: [
      {
        tipo: 'pix',
        valor: 51.0,
      },
    ],
    valorTotal: 51.0,
    cliente: 'João Silva',
    pago: true,
  };

  beforeEach(async () => {
    mockPedidoModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService,
        {
          provide: getModelToken(Pedido.name),
          useValue: mockPedidoModel,
        },
        {
          provide: EventEmitter,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a pedido successfully', async () => {
      mockPedidoModel.create.mockResolvedValue(mockPedido);

      const result = await service.create(mockCreatePedidoDto);

      expect(result).toEqual(mockPedido);
      expect(mockPedidoModel.create).toHaveBeenCalledWith(mockCreatePedidoDto);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'pedido.criado',
        mockPedido,
      );
    });

    it('should throw error when itens is empty', async () => {
      const dtoWithoutItens = { ...mockCreatePedidoDto, itens: [] };

      await expect(service.create(dtoWithoutItens)).rejects.toThrow(
        'Erro ao criar pedido: Error: Pedido deve conter pelo menos um item',
      );
    });

    it('should throw error when valorTotal is zero', async () => {
      const dtoWithZeroValue = { ...mockCreatePedidoDto, valorTotal: 0 };

      await expect(service.create(dtoWithZeroValue)).rejects.toThrow(
        'Erro ao criar pedido: BadRequestException: Valor total do pedido deve ser maior que zero',
      );
    });

    it('should throw error when valorTotal is negative', async () => {
      const dtoWithNegativeValue = { ...mockCreatePedidoDto, valorTotal: -10 };

      await expect(service.create(dtoWithNegativeValue)).rejects.toThrow(
        'Erro ao criar pedido: BadRequestException: Valor total do pedido deve ser maior que zero',
      );
    });

    it('should throw error when horarioAgendamento is set but agendado is false', async () => {
      const dtoWithInvalidSchedule = {
        ...mockCreatePedidoDto,
        agendado: false,
        horarioAgendamento: '14:00',
      };

      await expect(service.create(dtoWithInvalidSchedule)).rejects.toThrow(
        'Erro ao criar pedido: BadRequestException: Horário de agendamento só pode ser definido se o pedido for agendado',
      );
    });

    it('should allow horarioAgendamento when agendado is true', async () => {
      const dtoWithValidSchedule = {
        ...mockCreatePedidoDto,
        agendado: true,
        horarioAgendamento: '14:00',
      };
      mockPedidoModel.create.mockResolvedValue({
        ...mockPedido,
        ...dtoWithValidSchedule,
      });

      const result = await service.create(dtoWithValidSchedule);

      expect(result.agendado).toBe(true);
      expect(result.horarioAgendamento).toBe('14:00');
    });

    it('should throw error when pago is false but pagamentos has items', async () => {
      const dtoWithInvalidPayment = {
        ...mockCreatePedidoDto,
        pago: false,
        pagamentos: [{ tipo: 'pix', valor: 51.0 }],
      };

      await expect(service.create(dtoWithInvalidPayment)).rejects.toThrow(
        'Erro ao criar pedido: BadRequestException: Pedido não pode ter pagamentos se não estiver pago',
      );
    });

    it('should throw error when pago is true but pagamentos is empty', async () => {
      const dtoWithNoPagamentos = {
        ...mockCreatePedidoDto,
        pago: true,
        pagamentos: [],
      };

      await expect(service.create(dtoWithNoPagamentos)).rejects.toThrow(
        'Erro ao criar pedido: BadRequestException: Pedido marcado como pago deve conter pelo menos uma forma de pagamento',
      );
    });

    it('should create pedido when pago is false and pagamentos is empty', async () => {
      const dtoNotPaid = {
        ...mockCreatePedidoDto,
        pago: false,
        pagamentos: [],
      };
      const expectedPedido = { ...mockPedido, pago: false, pagamentos: [] };
      mockPedidoModel.create.mockResolvedValue(expectedPedido);

      const result = await service.create(dtoNotPaid);

      expect(result.pago).toBe(false);
      expect(result.pagamentos).toEqual([]);
    });

    it('should throw error when pedidoModel.create returns null', async () => {
      mockPedidoModel.create.mockResolvedValue(null);

      await expect(service.create(mockCreatePedidoDto)).rejects.toThrow(
        'Erro ao criar pedido: Error: Erro ao criar pedido',
      );
    });

    it('should throw error when database operation fails', async () => {
      mockPedidoModel.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(mockCreatePedidoDto)).rejects.toThrow(
        'Erro ao criar pedido: Error: Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all pedidos', async () => {
      const mockPedidos = [
        mockPedido,
        { ...mockPedido, _id: '507f1f77bcf86cd799439014' },
      ];
      mockPedidoModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockPedidos),
        }),
      });

      const result = await service.findAll();

      expect(result).toEqual(mockPedidos);
      expect(mockPedidoModel.find).toHaveBeenCalled();
    });

    it('should return empty array when no pedidos exist', async () => {
      mockPedidoModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw error when database operation fails', async () => {
      mockPedidoModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await expect(service.findAll()).rejects.toThrow(
        'Erro ao buscar pedidos: Error: Database error',
      );
    });
  });

  describe('findOne', () => {
    it('should return a pedido by id', async () => {
      mockPedidoModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockPedido),
        }),
      });

      const result = await service.findOne(1);

      expect(result).toEqual(mockPedido);
      expect(mockPedidoModel.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error when pedido is not found', async () => {
      mockPedidoModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.findOne(999)).rejects.toThrow(
        'Erro ao buscar pedido por ID: Error: Pedido com ID 999 não encontrado',
      );
    });

    it('should throw error when database operation fails', async () => {
      mockPedidoModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await expect(service.findOne(1)).rejects.toThrow(
        'Erro ao buscar pedido por ID: Error: Database error',
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdatePedidoDto = {
      cliente: 'Maria Santos',
      observacao: 'Sem mostarda',
    };

    it('should update a pedido successfully', async () => {
      const updatedPedido = { ...mockPedido, ...updateDto };
      mockPedidoModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updatedPedido),
        }),
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateDto,
      );

      expect(result).toEqual(updatedPedido);
      expect(mockPedidoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateDto,
        { new: true },
      );
    });

    it('should handle id with colon prefix', async () => {
      const updatedPedido = { ...mockPedido, ...updateDto };
      mockPedidoModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updatedPedido),
        }),
      });

      const result = await service.update(
        ':507f1f77bcf86cd799439011',
        updateDto,
      );

      expect(result).toEqual(updatedPedido);
      expect(mockPedidoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateDto,
        { new: true },
      );
    });

    it('should throw error when pedido is not found', async () => {
      mockPedidoModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.update('nonexistent-id', updateDto)).rejects.toThrow(
        'Erro ao atualizar pedido: Error: Pedido com ID nonexistent-id não encontrado',
      );
    });

    it('should throw error when database operation fails', async () => {
      mockPedidoModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await expect(
        service.update('507f1f77bcf86cd799439011', updateDto),
      ).rejects.toThrow('Erro ao atualizar pedido: Error: Database error');
    });
  });

  describe('remove', () => {
    it('should remove a pedido successfully', async () => {
      mockPedidoModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPedido),
      });

      const result = await service.remove(1);

      expect(result).toEqual(mockPedido);
      expect(mockPedidoModel.findByIdAndDelete).toHaveBeenCalledWith(1);
    });

    it('should throw error when pedido is not found', async () => {
      mockPedidoModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove(999)).rejects.toThrow(
        'Erro ao remover pedido: Error: Pedido com ID 999 não encontrado',
      );
    });

    it('should throw error when database operation fails', async () => {
      mockPedidoModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(service.remove(1)).rejects.toThrow(
        'Erro ao remover pedido: Error: Database error',
      );
    });
  });

  describe('buscarPedidos', () => {
    const createMockFind = <T>(result: T) => ({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(result),
        }),
      }),
    });

    it('should return pedidos with default filter (aberto)', async () => {
      const mockPedidos = [mockPedido];
      mockPedidoModel.find.mockReturnValue(createMockFind(mockPedidos));

      const result = await service.buscarPedidos();

      expect(result).toEqual(mockPedidos);
      expect(mockPedidoModel.find).toHaveBeenCalledWith({
        finalizado: { $in: [null, undefined] },
      });
    });

    it('should filter by finalizado = aberto', async () => {
      const mockPedidos = [mockPedido];
      mockPedidoModel.find.mockReturnValue(createMockFind(mockPedidos));

      const result = await service.buscarPedidos({ finalizado: 'aberto' });

      expect(result).toEqual(mockPedidos);
      expect(mockPedidoModel.find).toHaveBeenCalledWith({
        finalizado: { $in: [null, undefined] },
      });
    });

    it('should filter by finalizado = finalizado', async () => {
      const finalizadoPedido = { ...mockPedido, finalizado: true };
      mockPedidoModel.find.mockReturnValue(createMockFind([finalizadoPedido]));

      const result = await service.buscarPedidos({ finalizado: 'finalizado' });

      expect(result).toEqual([finalizadoPedido]);
      expect(mockPedidoModel.find).toHaveBeenCalledWith({
        finalizado: true,
      });
    });

    it('should filter by finalizado = cancelado', async () => {
      const canceladoPedido = { ...mockPedido, finalizado: false };
      mockPedidoModel.find.mockReturnValue(createMockFind([canceladoPedido]));

      const result = await service.buscarPedidos({ finalizado: 'cancelado' });

      expect(result).toEqual([canceladoPedido]);
      expect(mockPedidoModel.find).toHaveBeenCalledWith({
        finalizado: false,
      });
    });

    it('should filter by finalizado = all', async () => {
      const allPedidos = [
        mockPedido,
        { ...mockPedido, finalizado: true },
        { ...mockPedido, finalizado: false },
      ];
      mockPedidoModel.find.mockReturnValue(createMockFind(allPedidos));

      const result = await service.buscarPedidos({ finalizado: 'all' });

      expect(result).toEqual(allPedidos);
      expect(mockPedidoModel.find).toHaveBeenCalledWith({
        finalizado: { $in: [null, undefined, true, false] },
      });
    });

    it('should return empty array when no pedidos match filter', async () => {
      mockPedidoModel.find.mockReturnValue(createMockFind([]));

      const result = await service.buscarPedidos({ finalizado: 'finalizado' });

      expect(result).toEqual([]);
    });

    it('should sort by createdAt descending', async () => {
      const mockSort = jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockPedido]),
        }),
      });
      mockPedidoModel.find.mockReturnValue({ sort: mockSort });

      await service.buscarPedidos();

      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    });

    it('should throw InternalServerErrorException when database operation fails', async () => {
      mockPedidoModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('Database error')),
          }),
        }),
      });

      await expect(service.buscarPedidos()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.buscarPedidos()).rejects.toThrow(
        'Erro ao buscar pedidos: Error: Database error',
      );
    });
  });
});
