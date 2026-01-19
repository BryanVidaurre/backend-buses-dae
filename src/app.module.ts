import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { CarreraModule } from './carrera/carrera.module';
import { EstudianteCarreraModule } from './estudiante-carrera/estudiante-carrera.module';
import { BusModule } from './bus/bus.module';
import { QrTokenModule } from './qr-token/qr-token.module';
import { IngresoBusModule } from './ingreso-bus/ingreso-bus.module';
import { AuthModule } from './auth/auth.module';
import { EstudianteSemestreModule } from './estudiante-semestre/estudiante-semestre.module';
import { SemestreModule } from './semestre/semestre.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DB_NAME', 'buses_db.sqlite'),
        autoLoadEntities: true,
        synchronize: true,
      }),
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
