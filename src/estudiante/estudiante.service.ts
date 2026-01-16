/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import puppeteer, { Browser } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

import { Estudiante } from './entities/estudiante.entity';
import { Carrera } from '../carrera/entities/carrera.entity';
import { Semestre } from '../semestre/entities/semestre.entity';
import { EstudianteSemestre } from '../estudiante-semestre/entities/estudiante-semestre.entity';
import { EstudianteCarrera } from '../estudiante-carrera/entities/estudiante-carrera.entity';
import { QrToken } from '../qr-token/entities/qr-token.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Carrera)
    private carreraRepo: Repository<Carrera>,
    @InjectRepository(Semestre)
    private semestreRepo: Repository<Semestre>,
    @InjectRepository(EstudianteSemestre)
    private estSemRepo: Repository<EstudianteSemestre>,
    @InjectRepository(EstudianteCarrera)
    private estCarRepo: Repository<EstudianteCarrera>,
    @InjectRepository(QrToken)
    private qrTokenRepo: Repository<QrToken>,
  ) {}

  private getMailTransporter() {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'thepakross@gmail.com',
        pass: 'zxie zrfo cbek dysq',
      },
    });
  }

  async uploadExcel(
    file: Express.Multer.File,
    anio: number,
    semestreStr: string,
  ) {
    if (!file) throw new BadRequestException('Archivo no recibido');

    const logoBase64 = this.loadLogoBase64();
    await this.semestreRepo.update({ activo: true }, { activo: false });

    const semestre = await this.getOrCreateSemestre(anio, semestreStr);
    await this.semestreRepo.update(
      { semestre_id: semestre.semestre_id },
      { activo: true },
    );
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) throw new BadRequestException('El archivo está vacío');
    const carreraCache = new Map<string, Carrera>();

    const transporter = this.getMailTransporter();

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const BATCH_SIZE = 5;
    let procesados = 0;

    try {
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);

        await Promise.all(
          batch.map(async (row) => {
            try {
              // 1. Primero ejecutamos y esperamos el resultado
              const resultadoEnvio = await this.procesarFila(
                row,
                semestre,
                carreraCache,
                browser,
                transporter,
                logoBase64,
              );

              procesados++;

              // 2. Ahora sí usamos la variable para el log
              if (resultadoEnvio) {
                console.log(
                  `✅ [${procesados}/${rows.length}] ACEPTADO por servidor: ${row.PER_EMAIL}`,
                );
              } else {
                console.warn(
                  `⚠️ [${procesados}/${rows.length}] Procesado pero sin envío (Email ausente): ${row.PER_NRUT}`,
                );
              }
            } catch (error) {
              // Importante: incrementar procesados aquí también si quieres que el contador siga avanzando pese al error
              procesados++;
              console.error(`❌ [ERROR] RUT ${row.PER_NRUT}:`, error.message);
            }
          }),
        );
      }

      return {
        message: 'Tarjetas generadas y enviadas correctamente',
        total: procesados,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al procesar el Excel');
    } finally {
      await browser.close();
    }
  }

  private async procesarFila(
    row: any,
    semestre: Semestre,
    carreraCache: Map<string, Carrera>,
    browser: Browser,
    transporter: nodemailer.Transporter,
    logoBase64: string,
  ) {
    if (!row.PER_NRUT || !row.CAR_COD_CARRERA) return;

    let carrera = carreraCache.get(row.CAR_COD_CARRERA);
    if (!carrera) {
      carrera = await this.getOrCreateCarrera(row);
      carreraCache.set(row.CAR_COD_CARRERA, carrera);
    }

    const estudiante = await this.getOrCreateEstudiante(row);

    await this.getOrCreateEstSem(
      estudiante,
      semestre,
      carrera,
      (row.DIRECCION_FAMILIAR as string) || 'No especificada',
    );
    await this.getOrCreateEstCar(estudiante, carrera);

    let tokenStr: string;

    const qrExistente = await this.qrTokenRepo.findOne({
      where: { estudiante: { per_id: estudiante.per_id } },
      order: { fecha_creacion: 'DESC' },
    });

    if (qrExistente) {
      tokenStr = qrExistente.token;
    } else {
      tokenStr = uuidv4();
      await this.qrTokenRepo.save({
        token: tokenStr,
        fecha_creacion: new Date(),
        estudiante,
      });
    }

    const qrDataUrl = await QRCode.toDataURL(tokenStr, { margin: 1, scale: 8 });

    const page = await browser.newPage();
    const html = this.buildHtml(estudiante, qrDataUrl, logoBase64);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const element = await page.$('#tarjeta-container');
    const buffer = await element!.screenshot({ omitBackground: true });
    await page.close();

    if (estudiante.per_email) {
      const info = await transporter.sendMail({
        from: '"DAE Universidad de Tarapacá" <thepakross@gmail.com>',
        to: estudiante.per_email,
        subject: 'Tu Tarjeta de Acceso - Bus de Acercamiento DAE',
        html: this.buildEmailTemplate(estudiante),
        attachments: [
          {
            filename: `tarjeta_${estudiante.per_id}.png`,
            content: buffer,
            cid: 'tarjetaQR',
          },
        ],
      });
      return info.accepted.length > 0;
    }
    return false;
  }

  private buildEmailTemplate(estudiante: Estudiante): string {
    return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
    <div style="background-color: #355085; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 20px;">Servicio de Transporte DAE</h1>
    </div>
    
    <div style="padding: 30px; line-height: 1.6;">
      <p style="font-size: 18px;">Hola <strong>${estudiante.pna_nom} ${estudiante.pna_apat} ${estudiante.pna_amat}</strong>,</p>
      
      <p>Te informamos que tu <strong>Tarjeta de Acceso</strong> para el bus de acercamiento de la Universidad de Tarapacá ya está disponible para el presente periodo.</p>
      
      <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #0d47a1;"><strong>ℹ️ Información sobre tu código QR:</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">
          Si ya has sido beneficiario de este servicio en semestres anteriores, <strong>tu código QR sigue siendo el mismo</strong>.

      <div style="background-color: #f9f9f9; border-left: 4px solid #355085; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Instrucciones de uso:</strong></p>
        <ul style="margin: 10px 0;">
          <li>Descarga la imagen adjunta en este correo.</li>
          <li>Preséntala (digital o impresa) al subir al bus.</li>
          <li>Asegúrate de que el código QR sea legible para el escáner del bus.</li>
        </ul>
      </div>
    </div>

    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777;">
      <p style="margin: 5px 0;">Dirección de Asuntos Estudiantiles (DAE)</p>
      <p style="margin: 5px 0;">Universidad de Tarapacá</p>
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;">
      <p style="font-style: italic;">Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
  </div>
  `;
  }
  private async getOrCreateSemestre(anio: number, periodo: string) {
    let semestre = await this.semestreRepo.findOne({
      where: { anio, periodo },
    });

    if (!semestre) {
      semestre = await this.semestreRepo.save({
        anio,
        periodo,
        activo: true,
      });
    }

    return semestre;
  }

  private async getOrCreateCarrera(row: any) {
    let carrera = await this.carreraRepo.findOne({
      where: { car_cod_carrera: row.CAR_COD_CARRERA },
    });

    if (!carrera) {
      carrera = await this.carreraRepo.save({
        car_cod_carrera: row.CAR_COD_CARRERA,
        prg_nombre_corto: row.PRG_NOMBRE_CORTO,
        depto: row.DEPTO,
      });
    }

    return carrera;
  }

  private async getOrCreateEstudiante(row: any) {
    let estudiante = await this.estudianteRepo.findOne({
      where: { per_id: row.PER_NRUT },
    });

    if (!estudiante) {
      estudiante = await this.estudianteRepo.save({
        per_id: row.PER_NRUT,
        per_drut: row.PER_DRUT,
        pna_nom: row.PNA_NOM,
        pna_apat: row.PNA_APAT,
        pna_amat: row.PNA_AMAT,
        sex_cod: row.SEX_COD,
        per_email: row.PER_EMAIL,
        per_celular: row.PER_CELULAR || null,
        mat_anio_ingreso: row.MAT_ANIO_INGRESO,
      });
    }

    return estudiante;
  }

  private async getOrCreateEstSem(
    estudiante: Estudiante,
    semestre: Semestre,
    carrera: Carrera,
    direccion_familiar: string = 'No especificada',
  ) {
    const existe = await this.estSemRepo.findOne({
      where: {
        estudiante: { per_id: estudiante.per_id },
        semestre: { semestre_id: semestre.semestre_id },
        carrera: { car_cod_carrera: carrera.car_cod_carrera },
      },
    });

    if (!existe) {
      await this.estSemRepo.save({
        estudiante,
        semestre,
        carrera,
        direccion_familiar,
        estado: true,
      });
    }
  }

  private async getOrCreateEstCar(estudiante: Estudiante, carrera: Carrera) {
    const existe = await this.estCarRepo.findOne({
      where: {
        estudiante: { per_id: estudiante.per_id },
        carrera: { car_cod_carrera: carrera.car_cod_carrera },
      },
    });

    if (!existe) {
      await this.estCarRepo.save({
        estudiante,
        carrera,
        estado: true,
      });
    }
  }

  private loadLogoBase64(): string {
    const logoPath = path.join(process.cwd(), 'src/assets/logoUta.png');
    if (!fs.existsSync(logoPath)) return '';
    const buffer = fs.readFileSync(logoPath);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  }

  private buildHtml(
    estudiante: Estudiante,
    qrDataUrl: string,
    logoBase64: string,
  ) {
    return `
<!DOCTYPE html>
<html>
<head>
<style>
#tarjeta-container{
  width:450px;
  border:2px solid #355085;
  font-family:Arial;
  background:white;
}
.header{
  background:#355085;
  color:white;
  padding:15px;
  display:flex;
  align-items:center;
}
.logo{height:45px;margin-right:15px;}
.body{text-align:center;padding:20px;}
.name{font-size:16px;font-weight:bold;color:#355085;}
.qr{width:180px;margin-top:20px;}
.footer{
  text-align:center;
  padding:10px;
  background:#f4f4f4;
  font-size:12px;
}
</style>
</head>
<body>
<div id="tarjeta-container">
  <div class="header">
    ${logoBase64 ? `<img src="${logoBase64}" class="logo"/>` : ''}
    <div>
      <strong>Tarjeta de Acceso</strong><br/>
      Universidad de Tarapacá
    </div>
  </div>
  <div class="body">
    <div class="name">
      ${estudiante.pna_nom} ${estudiante.pna_apat} ${estudiante.pna_amat}
    </div>
    <img src="${qrDataUrl}" class="qr"/>
    <p>Escanea este QR para ingresar al bus</p>
  </div>
  <div class="footer">Dirección de Asuntos Estudiantiles</div>
</div>
</body>
</html>
`;
  }

  async getEstudiantesAutorizados() {
    return await this.estudianteRepo.query(`
    SELECT e.per_id, e.pna_nom, e.pna_apat, qt.token, es.est_sem_id
    FROM estudiante e
    JOIN estudiante_semestre es ON e.per_id = es.per_id
    JOIN semestre s ON s.semestre_id = es.semestre_id
    JOIN qr_token qt ON e.per_id = qt.per_id
    WHERE s.activo = true AND es.estado = true
  `);
  }

  async enviarNotificacionMasiva(asunto: string, mensaje: string) {
    const result = await this.estudianteRepo.query(`
    SELECT DISTINCT e.per_email 
    FROM estudiante e 
    JOIN estudiante_semestre es ON e.per_id = es.per_id 
    JOIN semestre s ON es.semestre_id = s.semestre_id 
    WHERE s.activo = 1 AND e.per_email IS NOT NULL
  `);

    const listaCorreos = result.map((r) => r.per_email);
    if (listaCorreos.length === 0)
      throw new BadRequestException('No hay alumnos activos.');

    const transporter = this.getMailTransporter();

    await transporter.sendMail({
      from: '"DAE Universidad de Tarapacá" <noreply@uta.cl>',
      to: 'thepakross@gmail.com',
      bcc: listaCorreos,
      subject: asunto,
      html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2c3e50; line-height: 1.6; max-width: 600px;">
        <p style="font-size: 16px;">Estimado(a) estudiante,</p>

        <div style="margin: 20px 0; white-space: pre-wrap; font-size: 15px;">${mensaje}</div>

        <p style="font-size: 15px;">Atentamente,</p>

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 13px;">
          <strong>Dirección de Asuntos Estudiantiles (DAE)</strong><br>
          Universidad de Tarapacá<br>
          Arica, Chile
        </div>

        <div style="margin-top: 20px; font-size: 11px; color: #bdc3c7; font-style: italic;">
          Este es un mensaje institucional automático. Por favor, no responda a esta dirección de correo.
        </div>
      </div>
    `,
    });

    return { totalEnviados: listaCorreos.length };
  }
}
