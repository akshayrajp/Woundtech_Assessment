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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @ApiOperation({
    summary: 'Create a patient',
  })
  @ApiCreatedResponse({
    type: PatientInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
  })
  @Post()
  create(@Body() dto: CreatePatientRequestDto): Promise<PatientInfoDto> {
    return this.patientsService.create(dto);
  }

  @ApiOperation({
    summary: 'Get paginated patients list',
  })
  @ApiOkResponse({
    type: PaginatedPatientsInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
  })
  @Get()
  findAll(
    @Query() query: PatientPaginationRequestDto,
  ): Promise<PaginatedPatientsInfoDto> {
    return this.patientsService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get patient by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    type: PatientInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID',
  })
  @ApiNotFoundResponse({
    description: 'Patient not found',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PatientInfoDto> {
    return this.patientsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update patient by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    type: PatientInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request or UUID',
  })
  @ApiNotFoundResponse({
    description: 'Patient not found',
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePatientDto,
  ): Promise<PatientInfoDto> {
    return this.patientsService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Delete patient by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    type: DeleteResultDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID',
  })
  @ApiNotFoundResponse({
    description: 'Patient not found',
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResultDto> {
    return this.patientsService.remove(id);
  }
}
