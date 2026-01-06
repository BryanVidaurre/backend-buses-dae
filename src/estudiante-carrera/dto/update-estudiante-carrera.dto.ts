/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateEstudianteCarreraDto } from './create-estudiante-carrera.dto';

export class UpdateEstudianteCarreraDto extends PartialType(CreateEstudianteCarreraDto) {}
