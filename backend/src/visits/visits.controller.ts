import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { VisitsService } from './visits.service';
import {
  CreateVisitRequestDto,
  PaginatedVisitInfoDto,
  UpdateVisitDto,
  VisitInfoDto,
  VisitPaginationRequestDto,
} from './dto/visit-crud.dto';
import { DeleteResultDto } from 'src/common/dto/deleteResult.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('visits')
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @ApiOperation({
    summary: 'Create a visit',
  })
  @ApiCreatedResponse({
    type: VisitInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
  })
  @ApiNotFoundResponse({
    description: 'Patient or clinician not found',
  })
  @ApiConflictResponse({
    description:
      'Visit already exists for this patient and clinician at that time',
  })
  @Post()
  create(@Body() createVisitDto: CreateVisitRequestDto): Promise<VisitInfoDto> {
    return this.visitsService.create(createVisitDto);
  }

  @ApiOperation({
    summary: 'Get paginated visits list',
  })
  @ApiOkResponse({
    type: PaginatedVisitInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
  })
  @Get()
  findAll(
    @Query() query: VisitPaginationRequestDto,
  ): Promise<PaginatedVisitInfoDto> {
    return this.visitsService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get visit by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    type: VisitInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID',
  })
  @ApiNotFoundResponse({
    description: 'Visit not found',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<VisitInfoDto> {
    return this.visitsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update visit by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    type: VisitInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request or UUID',
  })
  @ApiNotFoundResponse({
    description: 'Visit not found',
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVisitDto: UpdateVisitDto,
  ): Promise<VisitInfoDto> {
    return this.visitsService.update(id, updateVisitDto);
  }

  @ApiOperation({
    summary: 'Delete visit by id',
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
    description: 'Visit not found',
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResultDto> {
    return this.visitsService.remove(id);
  }
}
