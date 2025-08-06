import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsuarioSchema } from './schema/usuario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsuarioSchema }]),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService, MongooseModule],
})
export class UsuarioModule {}
