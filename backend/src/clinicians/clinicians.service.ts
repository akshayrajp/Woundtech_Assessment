import { Injectable } from '@nestjs/common';
import { CreateClinicianDto } from './dto/create-clinician.dto';
import { UpdateClinicianDto } from './dto/update-clinician.dto';

@Injectable()
export class CliniciansService {
  create(createClinicianDto: CreateClinicianDto) {
    return 'This action adds a new clinician';
  }

  findAll() {
    return `This action returns all clinicians`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clinician`;
  }

  update(id: number, updateClinicianDto: UpdateClinicianDto) {
    return `This action updates a #${id} clinician`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinician`;
  }
}
