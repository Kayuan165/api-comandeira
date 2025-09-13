import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

describe('ProdutoController', () => {
  let controller: ProdutoController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: ProdutoService;

  const mockProduto = {
    _id: '507f1f77bcf86cd799439011',
    nome: 'Produto Teste',
    preco: 99.99,
    descricao: 'Descrição do produto teste',
    categoria: 'Eletrônicos',
  };

  const mockProdutoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [
        {
          provide: ProdutoService,
          useValue: mockProdutoService,
        },
      ],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
    service = module.get<ProdutoService>(ProdutoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um produto com sucesso', async () => {
      const createProdutoDto: CreateProdutoDto = {
        preco: 99.99,
        descricao: 'Descrição do produto teste',
        numero: '12345',
        ativo: true,
        adicional: false,
      };

      mockProdutoService.create.mockResolvedValue(mockProduto);

      const result = await controller.create(createProdutoDto);

      expect(mockProdutoService.create).toHaveBeenCalledWith(createProdutoDto);
      expect(mockProdutoService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProduto);
    });

    it('deve lançar BadRequestException quando service.create falha', async () => {
      const createProdutoDto: CreateProdutoDto = {
        preco: 99.99,
        descricao: 'Descrição do produto teste',
        numero: '12345',
        ativo: true,
        adicional: false,
      };

      const error = new Error('Erro de validação');
      mockProdutoService.create.mockRejectedValue(error);

      await expect(controller.create(createProdutoDto)).rejects.toThrow(
        new BadRequestException(`Erro ao criar produto: ${error}`),
      );
      expect(mockProdutoService.create).toHaveBeenCalledWith(createProdutoDto);
    });

    //   it('deve propagar exceções já tratadas pelo service', async () => {
    //     const createProdutoDto: CreateProdutoDto = {
    //       preco: 99.99,
    //       descricao: 'Descrição do produto teste',
    //       numero: '',
    //       ativo: true,
    //       adicional: false,
    //     };

    //     const serviceError = new BadRequestException();
    //     mockProdutoService.create.mockRejectedValue(serviceError);
    //     await expect(controller.create(createProdutoDto)).rejects.toThrow(
    //       serviceError,
    //     );
    //   });
  });

  describe('findAll', () => {
    it('deve retornar todos os produtos', async () => {
      const mockProducts = [
        mockProduto,
        { ...mockProduto, _id: '507f1f77bcf86cd799439012' },
      ];
      mockProdutoService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(mockProdutoService.findAll).toHaveBeenCalled();
      expect(mockProdutoService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProducts);
    });

    it('deve propagar erros do service', async () => {
      const error = new BadRequestException('Erro ao buscar produtos');
      mockProdutoService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(mockProdutoService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um produto pelo ID', async () => {
      const productId = '507f1f77bcf86cd799439011';
      mockProdutoService.findOne.mockResolvedValue(mockProduto);

      const result = await controller.findOne(productId);

      expect(mockProdutoService.findOne).toHaveBeenCalledWith(productId);
      expect(mockProdutoService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProduto);
    });

    it('deve propagar erros do service', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const error = new BadRequestException('Produto não encontrado');
      mockProdutoService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(productId)).rejects.toThrow(error);
      expect(mockProdutoService.findOne).toHaveBeenCalledWith(productId);
    });

    it('deve chamar service.findOne com string vazia se ID não fornecido', async () => {
      const emptyId = '';
      mockProdutoService.findOne.mockResolvedValue(null);

      await controller.findOne(emptyId);

      expect(mockProdutoService.findOne).toHaveBeenCalledWith(emptyId);
    });
  });

  describe('update', () => {
    it('deve atualizar um produto com sucesso', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const updateProdutoDto: UpdateProdutoDto = {
        preco: 99.99,
        descricao: 'Descrição do produto teste',
        numero: '12345',
        ativo: true,
        adicional: false,
      };
      const updatedProduct = { ...mockProduto, ...updateProdutoDto };

      mockProdutoService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(productId, updateProdutoDto);

      expect(mockProdutoService.update).toHaveBeenCalledWith(
        productId,
        updateProdutoDto,
      );
      expect(mockProdutoService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedProduct);
    });

    it('deve propagar erros do service', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const updateProdutoDto: UpdateProdutoDto = {
        preco: 99.99,
        descricao: 'Descrição do produto teste',
        numero: '12345',
        ativo: true,
        adicional: false,
      };
      const error = new BadRequestException('Produto não encontrado');
      mockProdutoService.update.mockRejectedValue(error);

      await expect(
        controller.update(productId, updateProdutoDto),
      ).rejects.toThrow(error);
      expect(mockProdutoService.update).toHaveBeenCalledWith(
        productId,
        updateProdutoDto,
      );
    });

    it('deve chamar update mesmo com DTO vazio', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const emptyUpdateDto: UpdateProdutoDto = {
        preco: 99.99,
        descricao: 'Descrição do produto teste',
        numero: '12345',
        ativo: true,
        adicional: false,
      };
      const unchangedProduct = mockProduto;

      mockProdutoService.update.mockResolvedValue(unchangedProduct);

      const result = await controller.update(productId, emptyUpdateDto);

      expect(mockProdutoService.update).toHaveBeenCalledWith(
        productId,
        emptyUpdateDto,
      );
      expect(result).toEqual(unchangedProduct);
    });
  });

  describe('remove', () => {
    it('deve remover um produto com sucesso', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const successResponse = { message: 'Produto removido com sucesso' };

      mockProdutoService.remove.mockResolvedValue(successResponse);

      const result = await controller.remove(productId);

      expect(mockProdutoService.remove).toHaveBeenCalledWith(productId);
      expect(mockProdutoService.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual(successResponse);
    });

    it('deve propagar erros do service', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const error = new BadRequestException('Produto não encontrado');
      mockProdutoService.remove.mockRejectedValue(error);

      await expect(controller.remove(productId)).rejects.toThrow(error);
      expect(mockProdutoService.remove).toHaveBeenCalledWith(productId);
    });

    it('deve chamar service.remove com string vazia se ID não fornecido', async () => {
      const emptyId = '';
      const error = new BadRequestException('ID inválido');
      mockProdutoService.remove.mockRejectedValue(error);

      await expect(controller.remove(emptyId)).rejects.toThrow(error);
      expect(mockProdutoService.remove).toHaveBeenCalledWith(emptyId);
    });
  });

  describe('Integração Controller-Service', () => {
    it('deve garantir que todos os métodos do service são chamados corretamente', async () => {
      const createDto: CreateProdutoDto = {
        preco: 100,
        descricao: 'Teste',
        numero: '54321',
        ativo: true,
        adicional: false,
      };
      const updateDto: UpdateProdutoDto = {
        preco: 99.99,
        descricao: 'Descrição do produto teste',
        numero: '12345',
        ativo: true,
        adicional: false,
      };
      const productId = '507f1f77bcf86cd799439011';

      // Configurar mocks
      mockProdutoService.create.mockResolvedValue(mockProduto);
      mockProdutoService.findAll.mockResolvedValue([mockProduto]);
      mockProdutoService.findOne.mockResolvedValue(mockProduto);
      mockProdutoService.update.mockResolvedValue(mockProduto);
      mockProdutoService.remove.mockResolvedValue({ message: 'Removido' });

      // Act - Executar todos os métodos
      await controller.create(createDto);
      await controller.findAll();
      await controller.findOne(productId);
      await controller.update(productId, updateDto);
      await controller.remove(productId);

      // Assert - Verificar se todos foram chamados
      expect(mockProdutoService.create).toHaveBeenCalledWith(createDto);
      expect(mockProdutoService.findAll).toHaveBeenCalled();
      expect(mockProdutoService.findOne).toHaveBeenCalledWith(productId);
      expect(mockProdutoService.update).toHaveBeenCalledWith(
        productId,
        updateDto,
      );
      expect(mockProdutoService.remove).toHaveBeenCalledWith(productId);

      // Verificar quantidade de chamadas
      expect(mockProdutoService.create).toHaveBeenCalledTimes(1);
      expect(mockProdutoService.findAll).toHaveBeenCalledTimes(1);
      expect(mockProdutoService.findOne).toHaveBeenCalledTimes(1);
      expect(mockProdutoService.update).toHaveBeenCalledTimes(1);
      expect(mockProdutoService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
