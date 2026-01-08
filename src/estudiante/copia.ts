/* eslint-disable @typescript-eslint/no-unsafe-call */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable @typescript-eslint/no-unsafe-assignment */ import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
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
  async uploadExcel(
    file: Express.Multer.File,
    anio: number,
    semestreStr: string,
  ) {
    if (!file) throw new BadRequestException('Archivo no recibido');
    if (!anio || !semestreStr)
      throw new BadRequestException('Año o semestre inválido');
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);
      let count = 0;
      for (const row of rows) {
        if (
          !row.PER_NRUT ||
          !row.PER_DRUT ||
          !row.PNA_NOM ||
          !row.PNA_APAT ||
          !row.PNA_AMAT ||
          !row.SEX_COD ||
          !row.CAR_COD_CARRERA ||
          !row.PRG_NOMBRE_CORTO
        ) {
          console.warn('Fila ignorada por datos incompletos', row);
          continue;
        }
        let semestre = await this.semestreRepo.findOne({
          where: { anio, periodo: semestreStr },
        });
        if (!semestre) {
          semestre = this.semestreRepo.create({
            anio,
            periodo: semestreStr,
            activo: true,
          });
          await this.semestreRepo.save(semestre);
        }
        let carrera = await this.carreraRepo.findOne({
          where: { car_cod_carrera: row.CAR_COD_CARRERA },
        });
        if (!carrera) {
          carrera = this.carreraRepo.create({
            car_cod_carrera: row.CAR_COD_CARRERA,
            prg_nombre_corto: row.PRG_NOMBRE_CORTO,
            depto: row.DEPTO,
          });
          await this.carreraRepo.save(carrera);
        }
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
            per_email: row.PER_EMAIL || null,
            per_celular: row.PER_CELULAR || null,
          });
          await this.estudianteRepo.save(estudiante);
        }
        let estSem = await this.estSemRepo.findOne({
          where: {
            estudiante: { per_id: estudiante.per_id },
            semestre: { semestre_id: semestre.semestre_id },
            carrera: { car_cod_carrera: carrera.car_cod_carrera },
          },
          relations: ['estudiante', 'semestre', 'carrera'],
        });
        if (!estSem) {
          estSem = this.estSemRepo.create({
            estudiante,
            semestre,
            carrera,
            direccion_familiar: row.DIRECCION_FAMILIAR || 'No especificada',
            estado: true,
          });
          await this.estSemRepo.save(estSem);
        }
        let estCar = await this.estCarRepo.findOne({
          where: {
            estudiante: { per_id: estudiante.per_id },
            carrera: { car_cod_carrera: carrera.car_cod_carrera },
          },
          relations: ['estudiante', 'carrera'],
        });
        if (!estCar) {
          estCar = this.estCarRepo.create({
            estudiante: estudiante,
            carrera: carrera,
            estado: true,
          });
          await this.estCarRepo.save(estCar);
        }
        count++;
      }
      return { message: 'Archivo procesado correctamente', count };
    } catch (error) {
      console.error('Error al procesar Excel:', error.message);
      throw new BadRequestException(
        'No se pudo procesar el archivo. Revisa el formato y los datos.',
      );
    }
  }
}
