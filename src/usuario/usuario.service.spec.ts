import { Test, TestingModule } from '@nestjs/testing';
import { UserDocument, UsuarioService } from './usuario.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/usuario.schema';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

jest.mock('bcrypt');
describe('UsuarioService', () => {
  let service: UsuarioService;
  let mockUserModel: Partial<Record<keyof Model<UserDocument>, jest.Mock>>;

  const mockUser = {
    _id: '1',
    nome: 'Usuário Teste',
    email: 'teste@example.com',
    senha: 'hashed-password',
  };

  const chainableResolved = (result: any) => ({
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
  });

  const chainableRejected = (err: any) => ({
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockRejectedValue(err),
  });

  beforeEach(async () => {
    mockUserModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user ', async () => {
      const dto = { nome: 'Teste', email: 'teste@example.com', senha: 'plain' };

      (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashed');
      (mockUserModel.create as jest.Mock).mockResolvedValue({
        ...mockUser,
        senha: 'hashed',
      });

      const result = await service.create(dto);

      expect(bcrypt.hash as unknown as jest.Mock).toHaveBeenCalledWith(
        'plain',
        10,
      );

      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...dto,
        senha: 'hashed',
      });

      expect(result).toEqual({ ...mockUser, senha: 'hashed' });
    });
  });

  it('should create failed', async () => {
    const dto = { nome: 'Teste', email: 'teste@example.com', senha: 'plain' };

    (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashed');
    (mockUserModel.create as jest.Mock).mockRejectedValue(
      new Error('db error'),
    );

    await expect(service.create(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(service.create(dto)).rejects.toThrow(/Erro ao criar usuário/);
  });

  describe('validateUser', () => {
    it('should return user when email/password is correct', async () => {
      mockUserModel.findOne?.mockReturnValue(
        chainableResolved({ ...mockUser, senha: 'hashed' }),
      );
      (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('teste@example.com', 'plain');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'teste@example.com',
      });

      expect(bcrypt.compare as unknown as jest.Mock).toHaveBeenCalledWith(
        'plain',
        'hashed',
      );

      expect(result).toEqual({ ...mockUser, senha: 'hashed' });
    });

    it('should return null when user not found', async () => {
      mockUserModel.findOne?.mockReturnValue(chainableResolved(null));

      const result = await service.validateUser('nãoexiste@example.com', 'x');

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      mockUserModel.findOne?.mockReturnValue(
        chainableResolved({ ...mockUser, senha: 'hashed' }),
      );
      (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('teste@example.com', 'wrong');

      expect(result).toBeNull();
    });

    it('should throw InternalServerErrorException on db error', async () => {
      mockUserModel.findOne?.mockReturnValue(
        chainableRejected({ ...mockUser, senha: 'hashed' }),
      );
      await expect(service.validateUser('a@b.com', 'x')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserModel.find?.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockUser]),
      });
      const result = await service.findAll();

      expect(mockUserModel.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });

    it('should throw InternalServerErrorException on db error', async () => {
      mockUserModel.find?.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('db error')),
      });
      await expect(service.findAll()).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserModel.findById?.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne(':1');

      expect(mockUserModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ ...mockUser });
    });

    it('should throw InternalServerErrorException when user not found', async () => {
      mockUserModel.findById?.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = service.findOne('1');

      await expect(result).resolves.toBeNull();
    });
  });

  describe('finOneByEmail', () => {
    it('should return a user by email', async () => {
      mockUserModel.findOne?.mockReturnValue(
        chainableResolved({ ...mockUser, senha: 'hashed' }),
      );
      const result = await service.findOneByEmail('teste@example.com');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'teste@example.com',
      });
      expect(result).toEqual({ ...mockUser, senha: 'hashed' });
    });

    it('should throw InternalServerErrorException on db error', async () => {
      mockUserModel.findOne?.mockReturnValue(
        chainableRejected(new Error('db error')),
      );
      await expect(service.findOneByEmail('a@b.com')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const updateDto = { nome: 'Novo Nome' };
      mockUserModel.findByIdAndUpdate?.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ ...mockUser, nome: 'Novo Nome' }),
      });

      const result = await service.update(':1', updateDto);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        updateDto,
        { new: true },
      );
      expect(result).toEqual({ ...mockUser, ...updateDto });
    });

    it('should throw NotFoundException if user not exists', async () => {
      mockUserModel.findByIdAndUpdate?.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update('1', { nome: 'x' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on db error', async () => {
      mockUserModel.findByIdAndUpdate?.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('db error')),
      });

      await expect(service.update('1', { nome: 'x' })).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserModel.findByIdAndDelete?.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.remove(':1');
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'Usuário removido com sucesso' });
    });

    it('should throw NotFoundException if user not exists', async () => {
      mockUserModel.findByIdAndDelete?.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on db error', async () => {
      mockUserModel.findByIdAndDelete?.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('db error')),
      });

      await expect(service.remove('1')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });
});
