import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteModule } from './estudiante/estudiante.module';
import { CarreraModule } from './carrera/carrera.module';
import { EstudianteCarreraModule } from './estudiante-carrera/estudiante-carrera.module';
import { BusModule } from './bus/bus.module';
import { QrTokenModule } from './qr-token/qr-token.module';
import { IngresoBusModule } from './ingreso-bus/ingreso-bus.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'bv123',
      database: 'buses_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EstudianteModule,
    CarreraModule,
    EstudianteCarreraModule,
    BusModule,
    QrTokenModule,
    IngresoBusModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
