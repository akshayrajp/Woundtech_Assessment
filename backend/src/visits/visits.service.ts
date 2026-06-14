import {
  ConflictException,
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
import {
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  Repository,
} from 'typeorm';
import { Visit } from './entities/visit.entity';
import { DeleteResultDto } from 'src/common/dto/deleteResult.dto';
import { Patient } from 'src/patients/entities/patient.entity';
import { Clinician } from 'src/clinicians/entities/clinician.entity';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private visitsRepository: Repository<Visit>,

    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,

    @InjectRepository(Clinician)
    private cliniciansRepository: Repository<Clinician>,

    private logger: PinoLogger,
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
    const patient = await this.patientsRepository.findOneBy({
      id: createVisitDto.patientId,
    });

    if (!patient) {
      const errMsg = `Patient with id ${createVisitDto.patientId} not found`;
      this.logger.error(errMsg);
      throw new NotFoundException(errMsg);
    }

    const clinician = await this.cliniciansRepository.findOneBy({
      id: createVisitDto.clinicianId,
    });

    if (!clinician) {
      const errMsg = `Clinician with id ${createVisitDto.clinicianId} not found`;
      this.logger.error(errMsg);
      throw new NotFoundException(errMsg);
    }

    // Check if a visit already exists for the given patient and clinician at that time
    // If it does, throw an error to prevent duplicate visits
    const existingVisit = await this.visitsRepository.findOne({
      where: {
        patientId: createVisitDto.patientId,
        clinicianId: createVisitDto.clinicianId,
        visitedAt: createVisitDto.visitedAt,
      },
    });

    if (existingVisit) {
      const errMsg = `Visit already exists for this patient ${createVisitDto.patientId} and clinician ${createVisitDto.clinicianId} at that time ${createVisitDto.visitedAt.toDateString()}`;
      this.logger.error(errMsg);
      throw new ConflictException(errMsg);
    }

    const visitObject = this.visitsRepository.create({
      patientId: createVisitDto.patientId,
      clinicianId: createVisitDto.clinicianId,
      visitedAt: createVisitDto.visitedAt,
      notes: createVisitDto.notes,
    });

    const savedVisit = await this.visitsRepository.save(visitObject);
    this.logger.info(`Visit created successfully with id ${savedVisit.id}`);

    const visit = await this.visitsRepository.findOneOrFail({
      where: { id: savedVisit.id },
      relations: {
        patient: true,
        clinician: true,
      },
    });
    return this.toVisitInfoDto(visit);
  }

  async findAll(query: VisitPaginationRequestDto) {
    const take = query.limit ?? 10;
    const page = query.page ?? 1;
    const skip = (page - 1) * take;

    const where: FindOptionsWhere<Visit> = {
      deletedAt: IsNull(),
    };

    if (query.search) {
      where.notes = ILike(`%${query.search}%`);
    }

    if (query.patientIds) {
      where.patientId = In(query.patientIds);
    }

    if (query.clinicianIds) {
      where.clinicianId = In(query.clinicianIds);
    }

    const order: FindOptionsOrder<Visit> = query.orderBy
      ? {
          [query.orderBy]: query.sortBy,
        }
      : {
          visitedAt: 'DESC',
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
      const errMsg = `Visit with ID ${id} not found`;
      this.logger.error(errMsg);
      throw new NotFoundException(errMsg);
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
      const errMsg = `Visit with ID ${id} not found`;
      this.logger.error(errMsg);
      throw new NotFoundException(errMsg);
    }

    if (updateVisitDto.patientId) {
      const patient = await this.patientsRepository.findOneBy({
        id: updateVisitDto.patientId,
      });

      if (!patient) {
        const errMsg = `Patient with ID ${updateVisitDto.patientId} not found`;
        this.logger.error(errMsg);
        throw new NotFoundException(errMsg);
      }
    }

    if (updateVisitDto.clinicianId) {
      const clinician = await this.cliniciansRepository.findOneBy({
        id: updateVisitDto.clinicianId,
      });

      if (!clinician) {
        const errMsg = `Clinician with ID ${updateVisitDto.clinicianId} not found`;
        this.logger.error(errMsg);
        throw new NotFoundException(errMsg);
      }
    }

    Object.assign(visit, updateVisitDto);

    // Check if a visit already exists with the same details as the update dto
    // If it does, throw an error to prevent duplicate visits
    const duplicateVisit = await this.visitsRepository.findOne({
      where: {
        patientId: visit.patientId,
        clinicianId: visit.clinicianId,
        visitedAt: visit.visitedAt,
        notes: visit.notes,
      },
    });

    if (duplicateVisit) {
      const errMsg = `Visit already exists for this patient ${visit.patientId} and clinician ${visit.clinicianId} at that time ${visit.visitedAt.toDateString()}`;
      this.logger.error(errMsg);
      throw new ConflictException(errMsg);
    }

    await this.visitsRepository.save(visit);
    this.logger.info(`Visit with ID ${id} updated successfully`);

    const updatedVisit = await this.visitsRepository.findOneOrFail({
      where: { id },
      relations: {
        patient: true,
        clinician: true,
      },
    });
    return this.toVisitInfoDto(updatedVisit);
  }

  async remove(id: string): Promise<DeleteResultDto> {
    const result = await this.visitsRepository.delete(id);

    if (result.affected !== 1) {
      const errMsg = `Visit with ID ${id} not found`;
      this.logger.error(errMsg);
      throw new NotFoundException(errMsg);
    }

    this.logger.info(`Visit with ID ${id} deleted successfully`);
    return {
      id,
      deleted: true,
    };
  }
}
