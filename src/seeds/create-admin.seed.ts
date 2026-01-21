import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from '../auth/entities/admin-user.entity';

const dbName = process.env.DB_NAME ?? 'buses_db.sqlite';
if (!dbName) throw new Error('DB_NAME no está definido');

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbName,
  entities: [AdminUser],
  synchronize: false,
});

async function run() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Faltan SEED_ADMIN_EMAIL o SEED_ADMIN_PASSWORD en el .env');
  }

  await AppDataSource.initialize();

  try {
    const repo = AppDataSource.getRepository(AdminUser);

    const exists = await repo.findOne({ where: { email } });
    if (exists) {
      console.log(`El admin ya existe: ${email}`);
      return;
    }

    const admin = repo.create({
      email,
      password: await bcrypt.hash(password, 10),
      rol: 'ADMIN',
    });

    await repo.save(admin);

    console.log('Admin creado correctamente');
    console.log(`Email: ${email}`);
  } finally {
    await AppDataSource.destroy();
  }
}

run().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
