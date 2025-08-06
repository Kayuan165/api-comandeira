import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProdutoModule } from './produto/produto.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    UsuarioModule,
    AuthModule,
    ProdutoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
