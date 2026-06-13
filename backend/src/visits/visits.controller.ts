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

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  create(@Body() createVisitDto: CreateVisitRequestDto): Promise<VisitInfoDto> {
    return this.visitsService.create(createVisitDto);
  }

  @Get()
  findAll(
    @Query() query: VisitPaginationRequestDto,
  ): Promise<PaginatedVisitInfoDto> {
    return this.visitsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<VisitInfoDto> {
    return this.visitsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVisitDto: UpdateVisitDto,
  ): Promise<VisitInfoDto> {
    return this.visitsService.update(id, updateVisitDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResultDto> {
    return this.visitsService.remove(id);
  }
}
