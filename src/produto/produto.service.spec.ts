import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ProdutoService } from './produto.service';
import { Produto } from './schema/produto.schema';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

describe('ProdutoService', () => {
  let service: ProdutoService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let model: Model<Produto>;

  const mockProduto = {
    _id: '507f1f77bcf86cd799439011',
    preco: 99.99,
    descricao: 'X-Burguer',
    numero: '12345',
    ativo: true,
    adicional: false,
  };

  const mockProductModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    lean: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: getModelToken(Produto.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
    model = module.get<Model<Produto>>(getModelToken(Produto.name));
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

      mockProductModel.create.mockResolvedValue(mockProduto);

      const result = await service.create(createProdutoDto);

      expect(mockProductModel.create).toHaveBeenCalledWith(createProdutoDto);
      expect(result).toEqual(mockProduto);
    });

    it('deve lançar BadRequestException quando ocorre erro na criação', async () => {
      const createProdutoDto: CreateProdutoDto = {
        preco: 99.99,
        descricao: 'Descrição do produto teste',
        numero: '12345',
        ativo: true,
        adicional: false,
      };

      const error = new Error('Erro de validação');
      mockProductModel.create.mockRejectedValue(error);

      await expect(service.create(createProdutoDto)).rejects.toThrow(
        new BadRequestException(`Erro ao criar produto: ${error}`),
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os produtos', async () => {
      const mockProducts = [
        mockProduto,
        { ...mockProduto, _id: '507f1f77bcf86cd799439012' },
      ];

      mockProductModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockProducts),
        }),
      });

      const result = await service.findAll();

      expect(mockProductModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('deve lançar BadRequestException quando ocorre erro na busca', async () => {
      const error = new Error('Erro de conexão');

      mockProductModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(error),
        }),
      });

      await expect(service.findAll()).rejects.toThrow(
        new BadRequestException(`Erro ao buscar produtos: ${error}`),
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um produto pelo ID', async () => {
      const productId = '507f1f77bcf86cd799439011';

      mockProductModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockProduto),
        }),
      });

      const result = await service.findOne(productId);

      expect(mockProductModel.findById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduto);
    });

    it('deve remover ":" do início do ID se presente', async () => {
      const productId = ':507f1f77bcf86cd799439011';
      const cleanId = '507f1f77bcf86cd799439011';

      mockProductModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockProduto),
        }),
      });

      const result = await service.findOne(productId);

      expect(mockProductModel.findById).toHaveBeenCalledWith(cleanId);
      expect(result).toEqual(mockProduto);
    });

    it('deve lançar BadRequestException quando produto não é encontrado', async () => {
      const productId = '507f1f77bcf86cd799439011';

      mockProductModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.findOne(productId)).rejects.toThrow(
        new BadRequestException(
          `Erro ao buscar produto por ID: BadRequestException: Produto com ID ${productId} não encontrado`,
        ),
      );
    });

    it('deve lançar BadRequestException quando ocorre erro na busca', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const error = new Error('Erro de conexão');

      mockProductModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(error),
        }),
      });

      await expect(service.findOne(productId)).rejects.toThrow(
        new BadRequestException(`Erro ao buscar produto por ID: ${error}`),
      );
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

      mockProductModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updatedProduct),
        }),
      });

      const result = await service.update(productId, updateProdutoDto);

      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        productId,
        updateProdutoDto,
        { new: true },
      );
      expect(result).toEqual(updatedProduct);
    });

    it('deve remover ":" do início do ID se presente', async () => {
      const productId = ':507f1f77bcf86cd799439011';
      const cleanId = '507f1f77bcf86cd799439011';
      const updateProdutoDto: UpdateProdutoDto = {
        preco: 99.99,
        descricao: 'Descrição do produto teste',
        numero: '12345',
        ativo: true,
        adicional: false,
      };
      const updatedProduct = { ...mockProduto, ...updateProdutoDto };

      mockProductModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updatedProduct),
        }),
      });

      const result = await service.update(productId, updateProdutoDto);

      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        cleanId,
        updateProdutoDto,
        { new: true },
      );
      expect(result).toEqual(updatedProduct);
    });

    it('deve lançar NotFoundException quando produto não é encontrado', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const updateProdutoDto: UpdateProdutoDto = {
        preco: 99.99,
        descricao: 'Descrição do produto teste',
        numero: '12345',
        ativo: true,
        adicional: false,
      };

      mockProductModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.update(productId, updateProdutoDto)).rejects.toThrow(
        new NotFoundException('Usuário não encontrado'),
      );
    });

    it('deve lançar InternalServerErrorException quando ocorre erro na atualização', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const updateProdutoDto: UpdateProdutoDto = {
        preco: 99.99,
        descricao: 'Descrição do produto teste',
        numero: '12345',
        ativo: true,
        adicional: false,
      };
      const error = new Error('Erro de conexão');

      mockProductModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(error),
        }),
      });

      await expect(service.update(productId, updateProdutoDto)).rejects.toThrow(
        new InternalServerErrorException(`Erro ao atualizar usuário: ${error}`),
      );
    });

    it('deve relançar NotFoundException se já for uma instância', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const updateProdutoDto: UpdateProdutoDto = {
        preco: 99.99,
        descricao: 'Descrição do produto teste',
        numero: '12345',
        ativo: true,
        adicional: false,
      };
      const notFoundError = new NotFoundException('Produto não encontrado');

      mockProductModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(notFoundError),
        }),
      });

      await expect(service.update(productId, updateProdutoDto)).rejects.toThrow(
        notFoundError,
      );
    });
  });

  describe('remove', () => {
    it('deve remover um produto com sucesso', async () => {
      const productId = '507f1f77bcf86cd799439011';

      mockProductModel.findByIdAndDelete.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockProduto),
        }),
      });

      const result = await service.remove(productId);

      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith(
        productId,
      );
      expect(result).toEqual({ message: 'Produto removido com sucesso' });
    });

    it('deve remover ":" do início do ID se presente', async () => {
      const productId = ':507f1f77bcf86cd799439011';
      const cleanId = '507f1f77bcf86cd799439011';

      mockProductModel.findByIdAndDelete.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockProduto),
        }),
      });

      const result = await service.remove(productId);

      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith(cleanId);
      expect(result).toEqual({ message: 'Produto removido com sucesso' });
    });

    it('deve lançar NotFoundException quando produto não é encontrado', async () => {
      const productId = '507f1f77bcf86cd799439011';

      mockProductModel.findByIdAndDelete.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.remove(productId)).rejects.toThrow(
        new NotFoundException('Produto não encontrado'),
      );
    });

    it('deve lançar InternalServerErrorException quando ocorre erro na remoção', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const error = new Error('Erro de conexão');

      mockProductModel.findByIdAndDelete.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(error),
        }),
      });

      await expect(service.remove(productId)).rejects.toThrow(
        new InternalServerErrorException(`Erro ao remover produto: ${error}`),
      );
    });

    it('deve relançar NotFoundException se já for uma instância', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const notFoundError = new NotFoundException('Produto não encontrado');

      mockProductModel.findByIdAndDelete.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(notFoundError),
        }),
      });

      await expect(service.remove(productId)).rejects.toThrow(notFoundError);
    });
  });
});
