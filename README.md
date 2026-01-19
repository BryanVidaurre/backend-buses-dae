
---

# Backend: API de Gestión de Transporte DAE

Núcleo de servicios basado en NestJS para la administración del sistema de transporte universitario. Esta API centraliza la autenticación, el procesamiento de datos académicos y la gestión de geolocalización de la flota.

## Funcionalidades Principales

* **Autenticación y Seguridad:** Implementación de Passport.js con estrategias JWT para la protección de endpoints administrativos.
* **Procesamiento de Archivos:** Servicio especializado para la lectura y validación de padrones de estudiantes desde archivos Excel (.xlsx).
* **Gestión de Datos Estudiantiles:** CRUD completo de alumnos y vinculación con periodos académicos (año/semestre).
* **Servicios de Notificación:** Integración de Mailer para el envío masivo de comunicados institucionales.
* **Dashboard Data:** Endpoints optimizados para el consumo de métricas de uso, rankings y coordenadas geográficas.

## Arquitectura del Servidor

El proyecto sigue el patrón modular de NestJS, organizando la lógica por dominios de negocio:

* **Auth Module:** Manejo de login y generación de tokens.
* **Bus Module:** Lógica para la administración de patentes y recorridos.
* **Estudiante Module:** Carga masiva, validación de datos y base de datos de alumnos.
* **Analisis Module:** Queries complejas para reportes y visualización en el mapa.

## Requisitos Previos

* Node.js (v18 o superior)
* PostgreSQL / MySQL (según tu configuración de base de datos)
* NPM o Yarn

## Configuración e Instalación

1. **Instalar dependencias:**
```bash
npm install

```


2. **Variables de Entorno:**
Configurar el archivo `.env` en la raíz del proyecto con las siguientes claves:
```text
DB_HOST=localhost
DB_PORT=5432
DB_USER=usuario
DB_PASS=password
DB_NAME=buses_dae
JWT_SECRET=tu_clave_secreta
MAIL_HOST=smtp.gmail.com
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_app_password

```


3. **Ejecución del Servidor:**
```bash
# Modo desarrollo con auto-recarga
npm run start:dev

# Modo producción
npm run start:prod

```



## Pruebas de Software

* **Tests Unitarios:** `npm run test`
* **Tests de Integración (e2e):** `npm run test:e2e`
* **Cobertura de código:** `npm run test:cov`

## Estructura de Archivos

```text
src/
├── auth/          # Estrategias JWT y controladores de acceso.
├── bus/           # Entidades y servicios de la flota.
├── estudiante/    # Lógica de carga masiva y persistencia de alumnos.
├── common/        # Middlewares, filtros de excepciones y decoradores.
├── main.ts        # Punto de entrada de la aplicación.
└── app.module.ts  # Módulo raíz que orquesta las dependencias.

```

---

