import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateVisitRequestDto,
  UpdateVisitDto,
  VisitInfoDto,
  VisitPaginationRequestDto,
} from './dto/visit-crud.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { Visit } from './entities/visit.entity';
import { PatientsService } from 'src/patients/patients.service';
import { CliniciansService } from 'src/clinicians/clinicians.service';
import { DeleteResultDto } from 'src/common/dto/deleteResult.dto';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private visitsRepository: Repository<Visit>,

    @Inject(PatientsService)
    private patientsService: PatientsService,

    @Inject(CliniciansService)
    private cliniciansService: CliniciansService,
  ) {}

  private toVisitInfoDto(visit: Visit) {
    return {
      id: visit.id,
      patient: {
        id: visit.patient.id,
        givenName: visit.patient.givenName,
        familyName: visit.patient.familyName,
      },
      clinician: {
        id: visit.clinician.id,
        givenName: visit.clinician.givenName,
        familyName: visit.clinician.familyName,
      },
      visitedAt: visit.visitedAt,
      notes: visit.notes,
    };
  }

  async create(createVisitDto: CreateVisitRequestDto): Promise<VisitInfoDto> {
    const patient = await this.patientsService.findOne(
      createVisitDto.patientId,
    );

    const clinician = await this.cliniciansService.findOne(
      createVisitDto.clinicianId,
    );

    // Check if a visit already exists for the given patient and clinician at that time
    // If it does, throw an error to prevent duplicate visits
    const existingVisit = await this.visitsRepository.findOne({
      where: {
        patient,
        clinician,
        visitedAt: createVisitDto.visitedAt,
      },
    });

    if (existingVisit) {
      throw new ConflictException(
        'Visit already exists for this patient and clinician at that time',
      );
    }

    const visitObject = this.visitsRepository.create({
      patient,
      clinician,
      visitedAt: createVisitDto.visitedAt,
      notes: createVisitDto.notes,
    });

    const savedVisit = await this.visitsRepository.save(visitObject);

    return this.toVisitInfoDto(savedVisit);
  }

  async findAll(query: VisitPaginationRequestDto) {
    const take = query.limit ?? 10;
    const page = query.page ?? 1;
    const skip = (page - 1) * take;

    const where = query.search ? { notes: ILike(`%${query.search}%`) } : {};

    const order: FindOptionsOrder<Visit> = query.orderBy
      ? {
          [query.orderBy]: query.sortBy,
        }
      : {
          createdAt: 'ASC',
        };

    const [data, total] = await this.visitsRepository.findAndCount({
      select: {
        id: true,
        patient: {
          id: true,
          givenName: true,
          familyName: true,
        },
        clinician: {
          id: true,
          givenName: true,
          familyName: true,
        },
        visitedAt: true,
        notes: true,
      },
      relations: {
        patient: true,
        clinician: true,
      },
      where,
      order,
      take,
      skip,
    });

    return {
      data,
      total,
      limit: take,
      page,
    };
  }

  async findOne(id: string): Promise<VisitInfoDto> {
    // Check if a visit by this ID exists
    const visit = await this.visitsRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        patient: {
          id: true,
          givenName: true,
          familyName: true,
        },
        clinician: {
          id: true,
          givenName: true,
          familyName: true,
        },
        visitedAt: true,
        notes: true,
      },
      relations: {
        patient: true,
        clinician: true,
      },
    });

    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }

    return this.toVisitInfoDto(visit);
  }

  async update(
    id: string,
    updateVisitDto: UpdateVisitDto,
  ): Promise<VisitInfoDto> {
    // Check if a visit by this ID exists
    const visit = await this.visitsRepository.findOneBy({ id });
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }

    // Check if a visit already exists with the same details as the update dto
    // If it does, throw an error to prevent duplicate visits
    const duplicateVisit = await this.visitsRepository.findOne({
      where: {
        patient: {
          id: updateVisitDto.patientId,
        },
        clinician: {
          id: updateVisitDto.clinicianId,
        },
        visitedAt: updateVisitDto.visitedAt,
        notes: updateVisitDto.notes,
      },
    });

    if (duplicateVisit) {
      throw new ConflictException(
        'Visit already exists for this patient and clinician at that time',
      );
    }

    if (updateVisitDto.patientId) {
      const patient = await this.patientsService.findOne(
        updateVisitDto.patientId,
      );
      Object.assign(visit, { patient });
      delete updateVisitDto.patientId;
    }

    if (updateVisitDto.clinicianId) {
      const clinician = await this.cliniciansService.findOne(
        updateVisitDto.clinicianId,
      );
      Object.assign(visit, { clinician });
      delete updateVisitDto.clinicianId;
    }

    Object.assign(visit, updateVisitDto);
    const updatedVisit = await this.visitsRepository.save(visit);

    return this.toVisitInfoDto(updatedVisit);
  }

  async remove(id: string): Promise<DeleteResultDto> {
    const result = await this.visitsRepository.softDelete(id);

    if (result.affected !== 1) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    return {
      id,
      deleted: true,
    };
  }
}
