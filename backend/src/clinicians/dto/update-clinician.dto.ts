import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicianDto } from './create-clinician.dto';

export class UpdateClinicianDto extends PartialType(CreateClinicianDto) {}
