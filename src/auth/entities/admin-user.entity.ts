import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('admin_usuario')
export class AdminUser {
  @PrimaryGeneratedColumn()
  admin_id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'ADMIN' })
  rol: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: true })
  activo: boolean;
}
