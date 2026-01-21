

# Backend: API de Gestión de Transporte DAE

Núcleo de servicios basado en **NestJS** para la administración del sistema de transporte universitario.
Esta API centraliza la **autenticación**, el **procesamiento de datos académicos** y la **gestión de geolocalización de la flota**, garantizando seguridad y escalabilidad.

---

## Funcionalidades Principales

* **Autenticación y Seguridad**

  * Login administrativo con JWT
  * Hash de contraseñas con bcrypt
  * Control de acceso a endpoints protegidos

* **Procesamiento de Archivos**

  * Lectura y validación de padrones desde archivos Excel (.xlsx)

* **Gestión de Datos Estudiantiles**

  * CRUD completo de alumnos
  * Asociación con periodos académicos (año / semestre)

* **Servicios de Notificación**

  * Envío de correos institucionales mediante SMTP (Gmail)

* **Dashboard & Data**

  * Endpoints optimizados para métricas, rankings y visualización geográfica

---

## Arquitectura del Servidor

El proyecto sigue el patrón **modular de NestJS**, separando responsabilidades por dominio:

* **Auth Module**

  * Login
  * Generación de JWT
  * Gestión de administradores

* **Bus Module**

  * Administración de buses, patentes y recorridos

* **Estudiante Module**

  * Carga masiva
  * Validación y persistencia de alumnos

* **Analisis Module**

  * Consultas complejas para reportes y mapas

---

## Requisitos Previos

* Node.js **v18 o superior**
* Base de datos **SQLite** (por defecto)
* NPM o Yarn

---

## Configuración e Instalación

### 1️⃣ Instalación de dependencias

```bash
npm install
```

---

### 2️⃣ Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_NAME=buses_db.sqlite

JWT_SECRET= SECRET_SECRET

MAIL_HOST=smtp.gmail.com
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_app_password
```

---

## Inicialización del Administrador (Seed)

Por razones de **seguridad**, **NO existe un endpoint público** para crear administradores en producción.
La creación y recuperación de administradores se realiza **exclusivamente por seed**.

---

###  Crear el primer Administrador (Seed)

#### Variables necesarias

Agregar al `.env`:

```env
SEED_ADMIN_EMAIL=admin@uta.cl
SEED_ADMIN_PASSWORD=Admin123456
```

#### Ejecutar seed

```bash
npm run seed:admin
```

✔ Crea el administrador **solo si no existe**
✔ La contraseña se guarda hasheada con bcrypt

---

### Resetear contraseña de Administrador (Seed)

Utilizado cuando:

* Se olvidó la contraseña
* No existe flujo de recuperación por correo
* Situaciones de emergencia (dev / staging / prod)

#### Variables necesarias

```env
RESET_ADMIN_EMAIL=admin@uta.cl
RESET_ADMIN_PASSWORD=NuevaPassword123
```

#### Ejecutar seed

```bash
npm run seed:reset-admin

## Autenticación

### Login de administrador

**POST** `/auth/login`

```json
{
  "email": "admin@uta.cl",
  "password": "Admin123456"
}
```

Respuesta:

```json
{
  "access_token": "jwt_token",
  "admin": {
    "admin_id": 1,
    "email": "admin@uta.cl",
    "rol": "ADMIN"
  }
}
```

---

## Ejecución del Servidor

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod
```

---

## Pruebas de Software

* **Tests unitarios**

```bash
npm run test
```

* **Tests de integración (e2e)**

```bash
npm run test:e2e
```

* **Cobertura**

```bash
npm run test:cov
```

---

## Estructura del Proyecto

```text
src/
├── assets/                 # Recursos estáticos y archivos auxiliares
├── auth/                   # Autenticación, JWT y administración
├── bus/                    # Gestión de buses y recorridos
├── carrera/                # Carreras académicas
├── estudiante/             # CRUD de estudiantes
├── estudiante-carrera/     # Relación estudiante ↔ carrera
├── estudiante-semestre/    # Relación estudiante ↔ semestre
├── ingreso-bus/            # Registro de ingresos a buses
├── qr-token/               # Generación y validación de tokens QR
├── seeds/                  # Seeds (crear admin, reset password, etc.)
├── semestre/               # Gestión de periodos académicos
├── app.controller.ts       # Controlador raíz
├── app.controller.spec.ts  # Tests del controlador raíz
├── app.module.ts           # Módulo principal de la aplicación
├── app.service.ts          # Servicio principal
└── main.ts                 # Punto de entrada de la aplicación

```

---

