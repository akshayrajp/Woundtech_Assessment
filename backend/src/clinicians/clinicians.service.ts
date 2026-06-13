import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateClinicianRequestDto,
  ClinicianInfoDto,
  UpdateClinicianDto,
  PaginatedCliniciansInfoDto,
  ClinicianPaginationRequestDto,
} from './dto/clinician-crud.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinician } from './entities/clinician.entity';
import { Repository, ILike, FindOptionsOrder } from 'typeorm';
import { DeleteResultDto } from 'src/common/dto/deleteResult.dto';

@Injectable()
export class CliniciansService {
  constructor(
    @InjectRepository(Clinician)
    private cliniciansRepository: Repository<Clinician>,
  ) {}

  private toClinicianInfoDto(clinician: Clinician): ClinicianInfoDto {
    return {
      id: clinician.id,
      givenName: clinician.givenName,
      familyName: clinician.familyName,
      dateOfBirth: clinician.dateOfBirth,
      gender: clinician.gender,
      createdAt: clinician.createdAt,
      updatedAt: clinician.updatedAt,
    };
  }

  async create(
    createClinicianDto: CreateClinicianRequestDto,
  ): Promise<ClinicianInfoDto> {
    // Check if a clinician already exists with the same name and date of birth
    // If it does, throw an error to prevent duplicate clinicians
    const existingClinician = await this.cliniciansRepository.findOne({
      where: {
        givenName: createClinicianDto.givenName,
        familyName: createClinicianDto.familyName,
        dateOfBirth: new Date(createClinicianDto.dateOfBirth),
        gender: createClinicianDto.gender,
      },
    });

    if (existingClinician) {
      throw new ConflictException(
        'Clinician already exists with the same name and date of birth',
      );
    }

    const clinicianObject =
      this.cliniciansRepository.create(createClinicianDto);
    const clinician = await this.cliniciansRepository.save(clinicianObject);

    return this.toClinicianInfoDto(clinician);
  }

  async findAll(
    query: ClinicianPaginationRequestDto,
  ): Promise<PaginatedCliniciansInfoDto> {
    const take = query.limit ?? 10;
    const page = query.page ?? 1;
    const skip = (page - 1) * take;

    const where = query.search
      ? [
          { givenName: ILike(`%${query.search}%`) },
          { familyName: ILike(`%${query.search}%`) },
        ]
      : {};

    const order: FindOptionsOrder<Clinician> = query.orderBy
      ? {
          [query.orderBy]: query.sortBy,
        }
      : {
          createdAt: 'ASC',
        };

    const [data, total] = await this.cliniciansRepository.findAndCount({
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

  async findOne(id: string): Promise<ClinicianInfoDto> {
    const clinician = await this.cliniciansRepository.findOne({
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

    if (!clinician) {
      throw new NotFoundException(`Clinician with id ${id} not found`);
    }

    return this.toClinicianInfoDto(clinician);
  }

  async update(
    id: string,
    updateClinicianDto: UpdateClinicianDto,
  ): Promise<ClinicianInfoDto> {
    const clinician = await this.cliniciansRepository.findOneBy({ id });
    if (!clinician) {
      throw new NotFoundException(`Clinician with id ${id} not found`);
    }

    // Update values
    Object.assign(clinician, updateClinicianDto);

    // Check if a clinician already exists with the same name and date of birth
    // If it does, throw an error to prevent duplicate clinicians
    const existingClinician = await this.cliniciansRepository.findOne({
      where: {
        givenName: clinician.givenName,
        familyName: clinician.familyName,
        ...(clinician.dateOfBirth && {
          dateOfBirth: new Date(clinician.dateOfBirth),
        }),
        gender: clinician.gender,
      },
    });

    if (existingClinician) {
      throw new ConflictException(
        'Clinician already exists with the same name and date of birth',
      );
    }

    const updatedClinician = await this.cliniciansRepository.save(clinician);

    return this.toClinicianInfoDto(updatedClinician);
  }

  async remove(id: string): Promise<DeleteResultDto> {
    const result = await this.cliniciansRepository.delete(id);

    if (result.affected !== 1) {
      throw new NotFoundException(`Clinician with id ${id} not found`);
    }

    return {
      id,
      deleted: true,
    };
  }
}
