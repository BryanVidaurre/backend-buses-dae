// estudiante.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Carrera } from '../carrera/entities/carrera.entity';
import { Semestre } from '../semestre/entities/semestre.entity';
import { EstudianteSemestre } from '../estudiante-semestre/entities/estudiante-semestre.entity';
import { EstudianteCarrera } from '../estudiante-carrera/entities/estudiante-carrera.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Carrera) private carreraRepo: Repository<Carrera>,
    @InjectRepository(Semestre) private semestreRepo: Repository<Semestre>,
    @InjectRepository(EstudianteSemestre)
    private estSemRepo: Repository<EstudianteSemestre>,
    @InjectRepository(EstudianteCarrera)
    private estCarRepo: Repository<EstudianteCarrera>,
  ) {}

  async uploadExcel(file: any, anio: number, semestreNum: number) {
    if (!file) throw new BadRequestException('Archivo no recibido');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    const semestre = await this.semestreRepo.findOne({
      where: { anio, periodo: semestreNum.toString() },
    });
    if (!semestre) throw new BadRequestException('Semestre no encontrado');

    let count = 0;
    for (const row of rows) {
      // 1️⃣ Estudiante
      let estudiante = await this.estudianteRepo.findOne({
        where: { per_id: row.PER_NRUT },
      });
      if (!estudiante) {
        estudiante = this.estudianteRepo.create({
          per_id: row.PER_NRUT,
          per_drut: row.PER_DRUT,
          pna_nom: row.PNA_NOM,
          pna_apat: row.PNA_APAT,
          pna_amat: row.PNA_AMAT,
          sex_cod: row.SEX_COD,
          mat_anio_ingreso: row.MAT_ANIO_INGRESO,
          per_email: row.PER_EMAIL,
          per_celular: row.PER_CELULAR,
        });
        await this.estudianteRepo.save(estudiante);
      }

      // 2️⃣ Carrera
      const carrera = await this.carreraRepo.findOne({
        where: { car_cod_carrera: row.CAR_COD_CARRERA },
      });
      if (!carrera) continue; // O lanzar error

      // 3️⃣ EstudianteSemestre
      const estSem = this.estSemRepo.create({
        estudiante: estudiante,
        carrera: carrera,
        semestre: semestre,
        anio_ingreso: anio,
        direccion_familiar: row.DIRECCION_FAMILIAR,
        estado: true,
      });
      await this.estSemRepo.save(estSem);

      // 4️⃣ EstudianteCarrera (para seguimiento histórico)
      const estCar = this.estCarRepo.create({
        estudiante: estudiante,
        carrera: carrera,
        anio_ingreso: anio,
        estado: true,
      });
      await this.estCarRepo.save(estCar);

      count++;
    }

    return { message: 'Archivo procesado correctamente', count };
  }
}
