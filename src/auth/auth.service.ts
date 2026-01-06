import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from './entities/admin-user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminUser)
    private adminRepo: Repository<AdminUser>,
  ) {}

  async createAdmin(dto: CreateAdminDto) {
    const exists = await this.adminRepo.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('El admin ya existe');

    const admin = this.adminRepo.create({
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
    });

    return this.adminRepo.save(admin);
  }

  async login(dto: LoginDto) {
    const admin = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (!admin) throw new UnauthorizedException('Credenciales inválidas');

    const match = await bcrypt.compare(dto.password, admin.password);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');

    return { admin_id: admin.admin_id, email: admin.email, rol: admin.rol };
  }
}
