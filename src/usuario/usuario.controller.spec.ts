import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { NotFoundException } from '@nestjs/common';

type UsuarioServiceMock = jest.Mocked<
  Pick<UsuarioService, 'findAll' | 'update' | 'remove'>
>;

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioServiceMock;

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call usuarioService.findAll and return its result', async () => {
      const users = [{ _id: '1', email: 'teste@example.com', nome: 'a' }];
      service.findAll.mockResolvedValue(users as any);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toBe(users);
    });
  });

  describe('update', () => {
    it('should call usuarioService.update with correct parameters and return its result', async () => {
      const id = '1';
      const dto: UpdateUsuarioDto = { nome: 'Novo Nome' };
      const updatedUser = {
        _id: id,
        email: 'a@a.com',
        nome: 'Novo Nome',
      };

      service.update.mockResolvedValue(updatedUser as any);

      const result = await controller.update(id, dto);

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toBe(updatedUser);
    });

    it('should propagate errors from usuarioService.update', async () => {
      service.update.mockRejectedValue(
        new NotFoundException('Usuário não encontrado'),
      );

      await expect(controller.update('999', {})).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should call usuarioService.remove with correct id and return its result', async () => {
      service.remove.mockResolvedValue({
        message: 'Usuário removido com sucesso',
      });

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'Usuário removido com sucesso' });
    });

    it('should propagate errors from usuarioService.remove', async () => {
      service.remove.mockRejectedValue(
        new NotFoundException('Usuário não encontrado'),
      );

      await expect(controller.remove('999')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
