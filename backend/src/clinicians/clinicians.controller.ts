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
import { CliniciansService } from './clinicians.service';
import {
  CreateClinicianRequestDto,
  ClinicianInfoDto,
  UpdateClinicianDto,
  ClinicianDeletedDto,
  PaginatedCliniciansInfoDto,
} from './dto/clinician-crud.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';

@Controller('clinicians')
export class CliniciansController {
  constructor(private readonly cliniciansService: CliniciansService) {}

  @Post()
  create(
    @Body() createClinicianDto: CreateClinicianRequestDto,
  ): Promise<ClinicianInfoDto> {
    return this.cliniciansService.create(createClinicianDto);
  }

  @Get()
  findAll(
    @Query() query: PaginationRequestDto,
  ): Promise<PaginatedCliniciansInfoDto> {
    return this.cliniciansService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ClinicianInfoDto> {
    return this.cliniciansService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClinicianDto: UpdateClinicianDto,
  ): Promise<ClinicianInfoDto> {
    return this.cliniciansService.update(id, updateClinicianDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<ClinicianDeletedDto> {
    return this.cliniciansService.remove(id);
  }
}
