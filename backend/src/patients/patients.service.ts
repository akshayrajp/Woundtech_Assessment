import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreatePatientRequestDto,
  PatientInfoDto,
  UpdatePatientDto,
  PaginatedPatientsInfoDto,
  PatientPaginationRequestDto,
} from './dto/patient-crud.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository, ILike, FindOptionsOrder } from 'typeorm';
import { DeleteResultDto } from 'src/common/dto/deleteResult.dto';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,

    private readonly logger: PinoLogger,
  ) {}

  private toPatientInfoDto(patient: Patient): PatientInfoDto {
    return {
      id: patient.id,
      givenName: patient.givenName,
      familyName: patient.familyName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };
  }

  async create(
    createPatientDto: CreatePatientRequestDto,
  ): Promise<PatientInfoDto> {
    // Check if a patient already exists with the same name and date of birth
    // If it does, throw an error to prevent duplicate patients
    const existingPatient = await this.patientsRepository.findOne({
      where: {
        givenName: createPatientDto.givenName,
        familyName: createPatientDto.familyName,
        dateOfBirth: new Date(createPatientDto.dateOfBirth),
        gender: createPatientDto.gender,
      },
    });

    if (existingPatient) {
      const errMsg =
        'Patient already exists with the same name and date of birth';
      this.logger.error(errMsg);
      throw new ConflictException(errMsg);
    }

    const patientObject = this.patientsRepository.create(createPatientDto);
    const patient = await this.patientsRepository.save(patientObject);

    this.logger.info(`Patient created: ${patient.id}`);

    return this.toPatientInfoDto(patient);
  }

  async findAll(
    query: PatientPaginationRequestDto,
  ): Promise<PaginatedPatientsInfoDto> {
    const take = query.limit ?? 10;
    const page = query.page ?? 1;
    const skip = (page - 1) * take;

    const where = query.search
      ? [
          { givenName: ILike(`%${query.search}%`) },
          { familyName: ILike(`%${query.search}%`) },
        ]
      : {};

    const order: FindOptionsOrder<Patient> = query.orderBy
      ? {
          [query.orderBy]: query.sortBy,
        }
      : {
          createdAt: 'ASC',
        };

    const [data, total] = await this.patientsRepository.findAndCount({
      select: {
        id: true,
        givenName: true,
        familyName: true,
        dateOfBirth: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
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

  async findOne(id: string): Promise<PatientInfoDto> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      select: {
        id: true,
        givenName: true,
        familyName: true,
        dateOfBirth: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!patient) {
      const errMsg = `Patient with id ${id} not found`;
      this.logger.error(errMsg);
      throw new NotFoundException(errMsg);
    }

    return this.toPatientInfoDto(patient);
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<PatientInfoDto> {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      const errMsg = `Patient with id ${id} not found`;
      this.logger.error(errMsg);
      throw new NotFoundException(errMsg);
    }

    // Update values
    Object.assign(patient, updatePatientDto);

    // Check if a patient already exists with the same name and date of birth
    // If it does, throw an error to prevent duplicate patients
    const existingPatient = await this.patientsRepository.findOne({
      where: {
        givenName: patient.givenName,
        familyName: patient.familyName,
        ...(patient.dateOfBirth && {
          dateOfBirth: new Date(patient.dateOfBirth),
        }),
        gender: patient.gender,
      },
    });

    if (existingPatient) {
      const errMsg =
        'Patient already exists with the same name and date of birth';
      this.logger.error(errMsg);
      throw new ConflictException(errMsg);
    }

    const updatedPatient = await this.patientsRepository.save(patient);
    this.logger.info(`Updated patient with id ${id}`);

    return this.toPatientInfoDto(updatedPatient);
  }

  async remove(id: string): Promise<DeleteResultDto> {
    const result = await this.patientsRepository.delete(id);

    if (result.affected !== 1) {
      const errMsg = `Patient with id ${id} not found`;
      this.logger.error(errMsg);
      throw new NotFoundException(errMsg);
    }

    this.logger.info(`Deleted patient with id ${id}`);

    return {
      id,
      deleted: true,
    };
  }
}
