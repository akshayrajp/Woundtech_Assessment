import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CliniciansService } from './clinicians.service';
import { CreateClinicianDto } from './dto/create-clinician.dto';
import { UpdateClinicianDto } from './dto/update-clinician.dto';

@Controller('clinicians')
export class CliniciansController {
  constructor(private readonly cliniciansService: CliniciansService) {}

  @Post()
  create(@Body() createClinicianDto: CreateClinicianDto) {
    return this.cliniciansService.create(createClinicianDto);
  }

  @Get()
  findAll() {
    return this.cliniciansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cliniciansService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClinicianDto: UpdateClinicianDto,
  ) {
    return this.cliniciansService.update(+id, updateClinicianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cliniciansService.remove(+id);
  }
}
