import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProdutoModule } from './produto/produto.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { MetricsModule } from './metrics/metrics.module';
import { monngooseConfig } from './config/mongoose.config';

@Module({
  imports: [
    MongooseModule.forRoot(monngooseConfig.uri as string),
    UsuarioModule,
    AuthModule,
    ProdutoModule,
    PedidosModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
