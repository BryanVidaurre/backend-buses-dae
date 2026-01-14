import { EstudianteSemestreModule } from './estudiante-semestre/estudiante-semestre.module';
import { SemestreModule } from './semestre/semestre.module';
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
      type: 'sqlite',
      database: 'buses_db.sqlite', // Se creará este archivo en la raíz de tu proyecto
      autoLoadEntities: true,
      synchronize: true, // Esto creará las tablas automáticamente
    }),
    EstudianteModule,
    CarreraModule,
    EstudianteCarreraModule,
    BusModule,
    QrTokenModule,
    IngresoBusModule,
    AuthModule,
    EstudianteSemestreModule,
    SemestreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
