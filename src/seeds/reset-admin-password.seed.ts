import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from '../auth/entities/admin-user.entity';

const dbName = process.env.DB_NAME ?? 'buses_db.sqlite';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbName,
  entities: [AdminUser],
  synchronize: false,
});

async function run() {
  const email = process.env.RESET_ADMIN_EMAIL;
  const newPassword = process.env.RESET_ADMIN_PASSWORD;

  if (!email || !newPassword) {
    throw new Error(
      'Faltan RESET_ADMIN_EMAIL o RESET_ADMIN_PASSWORD en el .env',
    );
  }

  await AppDataSource.initialize();

  try {
    const repo = AppDataSource.getRepository(AdminUser);

    const admin = await repo.findOne({ where: { email } });
    if (!admin) {
      throw new Error(`No existe admin con email ${email}`);
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await repo.save(admin);

    console.log('Contraseña reseteada correctamente');
    console.log(`Admin: ${email}`);
  } finally {
    await AppDataSource.destroy();
  }
}

run().catch((err: Error) => {
  console.error('Error en reset seed:', err.message);
  process.exit(1);
});
