import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Sistema de Control de Acceso Estudiantil (Buses UTA)')
    .setDescription(
      '### API de Gestión de Transporte Institucional\n' +
        'Este servicio centraliza la validación de acceso al transporte mediante:\n\n' +
        '* **Identidad Digital:** Gestión de tokens QR únicos por estudiante y semestre.\n' +
        '* **Control de Flota:** Monitoreo de buses, patentes y asignación de horarios de recorrido.\n' +
        '* **Sincronización Batch:** Endpoints diseñados para la carga masiva de ingresos capturados offline por la aplicación móvil.\n' +
        '* **Geolocalización:** Auditoría de coordenadas (Lat/Lon) en cada registro de ingreso.',
    )
    .setVersion('1.2')
    .addTag('Autenticación', 'Seguridad y acceso al sistema administrativo')
    .addTag('Estudiantes', 'Gestión de personas y carga masiva de datos')
    .addTag('Ingresos', 'Registro de validaciones QR y sincronización masiva')
    .addTag('Buses', 'Configuración de flota, recorridos y horarios')
    .addTag('Configuración Académica', 'Gestión de semestres y carreras')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none', // Mantiene los tags cerrados por defecto para una mejor vista
      filter: true, // Añade una barra de búsqueda para filtrar endpoints
    },
  });

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3000);
}
bootstrap();
