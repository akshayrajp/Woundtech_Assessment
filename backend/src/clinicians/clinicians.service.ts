import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateClinicianRequestDto,
  ClinicianInfoDto,
  UpdateClinicianDto,
  ClinicianDeletedDto,
  PaginatedCliniciansInfoDto,
} from './dto/clinician-crud.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinician } from './entities/clinician.entity';
import { Repository, ILike } from 'typeorm';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';

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
    const clinicianObject =
      this.cliniciansRepository.create(createClinicianDto);
    const clinician = await this.cliniciansRepository.save(clinicianObject);

    return this.toClinicianInfoDto(clinician);
  }

  async findAll(
    query: PaginationRequestDto,
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

    const results = await this.cliniciansRepository.findAndCount({
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
      take,
      skip,
    });

    return {
      data: results[0],
      total: results[1],
      limit: take,
      page,
    };
  }

  async findOne(id: string): Promise<ClinicianInfoDto> {
    const clinician = await this.cliniciansRepository.findOneBy({ id });

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

    Object.assign(clinician, updateClinicianDto);
    const updatedClinician = await this.cliniciansRepository.save(clinician);

    return this.toClinicianInfoDto(updatedClinician);
  }

  async remove(id: string): Promise<ClinicianDeletedDto> {
    const result = await this.cliniciansRepository.softDelete(id);

    if (result.affected !== 1) {
      throw new NotFoundException(`Clinician with id ${id} not found`);
    }

    return {
      id,
      deleted: true,
    };
  }
}
