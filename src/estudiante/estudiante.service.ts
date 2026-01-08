/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Carrera } from '../carrera/entities/carrera.entity';
import { Semestre } from '../semestre/entities/semestre.entity';
import { EstudianteSemestre } from '../estudiante-semestre/entities/estudiante-semestre.entity';
import { EstudianteCarrera } from '../estudiante-carrera/entities/estudiante-carrera.entity';
import { QrToken } from '../qr-token/entities/qr-token.entity';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

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
    @InjectRepository(QrToken)
    private qrTokenRepo: Repository<QrToken>,
  ) {}

  /**
   * Convierte HTML a Buffer PNG recortando exactamente el contenedor de la tarjeta
   */
  private async htmlToPng(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    try {
      const page = await browser.newPage();
      // Establecemos un viewport base, pero el screenshot lo hará el elemento
      await page.setViewport({ width: 800, height: 800 });
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const element = await page.$('#tarjeta-container');
      if (!element)
        throw new Error('No se encontró el contenedor de la tarjeta');

      const screenshot = await element.screenshot({
        type: 'png',
        omitBackground: true, // Mantiene transparencia fuera del contenedor si la hubiera
      });

      await browser.close();
      return Buffer.from(screenshot);
    } catch (error) {
      await browser.close();
      throw error;
    }
  }

  async uploadExcel(
    file: Express.Multer.File,
    anio: number,
    semestreStr: string,
  ) {
    if (!file) throw new BadRequestException('Archivo no recibido');

    // Cargar Logo UTA y convertir a Base64 para Puppeteer
    const logoPath = path.join(process.cwd(), 'src/assets/logoUta.png');
    let logoBase64 = '';
    if (fs.existsSync(logoPath)) {
      const buffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${buffer.toString('base64')}`;
    }

    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'thepakross@gmail.com',
          pass: 'ypgx hwmq milv ofnr',
        },
      });

      let count = 0;

      for (const row of rows) {
        if (!row.PER_NRUT || !row.CAR_COD_CARRERA) continue;

        // --- LÓGICA DE BASE DE DATOS (Mantenida de tu original) ---
        let semestre = await this.semestreRepo.findOne({
          where: { anio, periodo: semestreStr },
        });
        if (!semestre) {
          semestre = await this.semestreRepo.save(
            this.semestreRepo.create({
              anio,
              periodo: semestreStr,
              activo: true,
            }),
          );
        }

        let carrera = await this.carreraRepo.findOne({
          where: { car_cod_carrera: row.CAR_COD_CARRERA },
        });
        if (!carrera) {
          carrera = await this.carreraRepo.save(
            this.carreraRepo.create({
              car_cod_carrera: row.CAR_COD_CARRERA,
              prg_nombre_corto: row.PRG_NOMBRE_CORTO,
              depto: row.DEPTO,
            }),
          );
        }

        let estudiante = await this.estudianteRepo.findOne({
          where: { per_id: row.PER_NRUT },
        });
        if (!estudiante) {
          estudiante = await this.estudianteRepo.save(
            this.estudianteRepo.create({
              per_id: row.PER_NRUT,
              per_drut: row.PER_DRUT,
              pna_nom: row.PNA_NOM,
              pna_apat: row.PNA_APAT,
              pna_amat: row.PNA_AMAT,
              sex_cod: row.SEX_COD,
              per_email: row.PER_EMAIL,
              mat_anio_ingreso: row.MAT_ANIO_INGRESO,
              per_celular: row.PER_CELULAR || null,
            }),
          );
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

        // Generar Token y QR
        const token = uuidv4();
        const qrDataUrl = await QRCode.toDataURL(token, {
          margin: 1,
          scale: 10,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        await this.qrTokenRepo.save(
          this.qrTokenRepo.create({
            token,
            fecha_creacion: new Date(),
            estudiante,
          }),
        );

        // --- GENERACIÓN DE HTML (Sin bordes redondeados y con logo a la izquierda) ---
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; background-color: transparent; }
            #tarjeta-container {
              width: 450px;
              border: 2px solid #355085;
              background-color: white;
              font-family: 'Segoe UI', Arial, sans-serif;
              display: inline-block;
            }
            .header {
              background: linear-gradient(135deg, #355085 0%, #0059b3 100%);
              padding: 15px;
              display: flex;
              align-items: center;
              color: white;
            }
            .logo {
              height: 45px;
              margin-right: 15px;
            }
            .header-info h1 {
              margin: 0;
              font-size: 18px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .header-info p {
              margin: 2px 0 0;
              font-size: 10px;
              opacity: 0.9;
            }
            .body-content {
              padding: 20px;
              text-align: center;
            }
            .student-name-box {
              background-color: #f4f7f9;
              padding: 15px;
              margin-bottom: 20px;
              border-left: 4px solid #355085;
              text-align: left;
            }
            .label { font-size: 10px; color: #666; text-transform: uppercase; }
            .name { font-size: 16px; font-weight: bold; color: #355085; margin-top: 5px; }
            .qr-image {
                width: 180px;
                height: 180px;
                padding: 10px;
                border: 1px solid #eee;
            }
            .footer {
              background-color: #f4f7f9;
              padding: 10px;
              font-size: 12px;
              color: #355085;
              font-weight: bold;
              border-top: 1px solid #ddd;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div id="tarjeta-container">
            <div class="header">
              ${logoBase64 ? `<img src="${logoBase64}" class="logo" />` : ''}
              <div class="header-info">
                <h1>Tarjeta de Acceso</h1>
                <p>UNIVERSIDAD DE TARAPACÁ</p>
              </div>
            </div>
            <div class="body-content">
              <div class="student-name-box">
                <div class="label">Titular</div>
                <div class="name">${estudiante.pna_nom} ${estudiante.pna_apat} ${estudiante.pna_amat}</div>
              </div>
              <img src="${qrDataUrl}" class="qr-image" />
              <p style="font-size: 11px; color: #555; margin-top: 10px;">
                Escanea este código para ingresar al bus
              </p>
            </div>
            <div class="footer">
              Dirección de Asuntos Estudiantiles
            </div>
          </div>
        </body>
        </html>
        `;

        // Generar imagen final
        const tarjetaBuffer = await this.htmlToPng(htmlContent);

        if (estudiante.per_email) {
          await transporter.sendMail({
            from: '"DAE Universidad de Tarapacá" <noreply@uta.cl>',
            to: estudiante.per_email,
            subject: 'Tu Tarjeta de Acceso DAE - Bus de Acercamiento',
            // Cuerpo del correo en HTML
            html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
      <div style="background-color: #355085; padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Dirección de Asuntos Estudiantiles</h2>
      </div>
      
      <div style="padding: 30px; line-height: 1.6;">
        <p style="font-size: 18px;">Hola <strong>${estudiante.pna_nom}</strong>,</p>
        
        <p>Esperamos que te encuentres muy bien. Te informamos que tu <strong>Tarjeta de Acceso para el Bus de Acercamiento</strong> ya ha sido generada exitosamente para el presente semestre.</p>
        
        <div style="background-color: #f9f9f9; border-left: 4px solid #0059b3; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Instrucciones importantes:</strong></p>
          <ul style="margin: 10px 0 0; padding-left: 20px;">
            <li>Adjunto a este correo encontrarás tu tarjeta en formato imagen (PNG).</li>
            <li>Puedes guardarla en tu celular o imprimirla.</li>
            <li>Deberás presentar el <strong>Código QR</strong> al conductor al momento de subir al bus.</li>
          </ul>
        </div>

        <p>Esta tarjeta es personal e intransferible. El uso correcto de este beneficio permite que sigamos mejorando el servicio para toda la comunidad estudiantil.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 12px; color: #777;">Si tienes dudas, acércate a las oficinas de la DAE o contáctanos a través de nuestros canales oficiales.</p>
        </div>
      </div>

      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Universidad de Tarapacá - Arica, Chile</p>
        <p style="margin: 5px 0 0;">Este es un mensaje automático, por favor no respondas a este correo.</p>
      </div>
    </div>
    `,
            attachments: [
              {
                filename: 'tarjeta-acceso.png',
                content: tarjetaBuffer,
              },
            ],
          });
        }
        count++;
      }

      return { message: 'Tarjetas generadas y enviadas correctamente', count };
    } catch (error) {
      console.error('Error:', error);
      throw new BadRequestException('Error al procesar el archivo Excel.');
    }
  }
}
