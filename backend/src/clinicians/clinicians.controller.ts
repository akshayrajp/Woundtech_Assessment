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
  PaginatedCliniciansInfoDto,
  ClinicianPaginationRequestDto,
} from './dto/clinician-crud.dto';
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

@ApiTags('clinicians')
@Controller('clinicians')
export class CliniciansController {
  constructor(private readonly cliniciansService: CliniciansService) {}

  @ApiOperation({
    summary: 'Create a clinician',
  })
  @ApiCreatedResponse({
    type: ClinicianInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
  })
  @Post()
  create(
    @Body() createClinicianDto: CreateClinicianRequestDto,
  ): Promise<ClinicianInfoDto> {
    return this.cliniciansService.create(createClinicianDto);
  }

  @ApiOperation({
    summary: 'Get paginated clinicians list',
  })
  @ApiOkResponse({
    type: PaginatedCliniciansInfoDto,
  })
  @Get()
  findAll(
    @Query() query: ClinicianPaginationRequestDto,
  ): Promise<PaginatedCliniciansInfoDto> {
    return this.cliniciansService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get clinician by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    type: ClinicianInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
  })
  @ApiNotFoundResponse({
    description: 'Clinician not found',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ClinicianInfoDto> {
    return this.cliniciansService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update clinician by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    type: ClinicianInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
  })
  @ApiNotFoundResponse({
    description: 'Clinician not found',
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClinicianDto: UpdateClinicianDto,
  ): Promise<ClinicianInfoDto> {
    return this.cliniciansService.update(id, updateClinicianDto);
  }

  @ApiOperation({
    summary: 'Delete clinician by id',
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
    description: 'Invalid request',
  })
  @ApiNotFoundResponse({
    description: 'Clinician not found',
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResultDto> {
    return this.cliniciansService.remove(id);
  }
}
