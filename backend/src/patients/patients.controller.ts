import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import {
  CreatePatientRequestDto,
  PaginatedPatientsInfoDto,
  PatientInfoDto,
  PatientPaginationRequestDto,
  UpdatePatientDto,
} from './dto/patient-crud.dto';
import { DeleteResultDto } from 'src/common/dto/deleteResult.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() dto: CreatePatientRequestDto): Promise<PatientInfoDto> {
    return this.patientsService.create(dto);
  }

  @Get()
  findAll(
    @Query() query: PatientPaginationRequestDto,
  ): Promise<PaginatedPatientsInfoDto> {
    return this.patientsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PatientInfoDto> {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePatientDto,
  ): Promise<PatientInfoDto> {
    return this.patientsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResultDto> {
    return this.patientsService.remove(id);
  }
}
