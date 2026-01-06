import { PartialType } from '@nestjs/mapped-types';
import { CreateQrTokenDto } from './create-qr-token.dto';

export class UpdateQrTokenDto extends PartialType(CreateQrTokenDto) {}
