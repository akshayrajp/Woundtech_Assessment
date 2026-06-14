import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import {
  CreatePatientRequestDto,
  UpdatePatientDto,
} from './dto/patient-crud.dto';
import { Gender } from 'src/common/enums/gender.enum';

describe('PatientsService', () => {
  let service: PatientsService;
  let repository: jest.Mocked<Repository<Patient>>;
  let logger: jest.Mocked<PinoLogger>;

  const mockPatient: Patient = {
    id: 'patient-id',
    givenName: 'John',
    familyName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
    gender: Gender.male,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    visits: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            findAndCount: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: PinoLogger,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            trace: jest.fn(),
            fatal: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    repository = module.get(getRepositoryToken(Patient));
    logger = module.get(PinoLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a patient', async () => {
      const dto: CreatePatientRequestDto = {
        givenName: 'John',
        familyName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: Gender.male,
      };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(mockPatient);
      repository.save.mockResolvedValue(mockPatient);

      const result = await service.create(dto);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        id: mockPatient.id,
        givenName: mockPatient.givenName,
        familyName: mockPatient.familyName,
        dateOfBirth: mockPatient.dateOfBirth,
        gender: mockPatient.gender,
        createdAt: mockPatient.createdAt,
        updatedAt: mockPatient.updatedAt,
      });

      expect(logger.info).toHaveBeenCalledWith(
        `Patient created: ${mockPatient.id}`,
      );
    });

    it('should throw ConflictException when patient already exists', async () => {
      const dto: CreatePatientRequestDto = {
        givenName: 'John',
        familyName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: Gender.male,
      };

      repository.findOne.mockResolvedValue(mockPatient);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(repository.save).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated patients', async () => {
      repository.findAndCount.mockResolvedValue([[mockPatient], 1]);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      });

      expect(result).toEqual({
        data: [mockPatient],
        total: 1,
        limit: 10,
        page: 1,
      });

      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a patient', async () => {
      repository.findOne.mockResolvedValue(mockPatient);

      const result = await service.findOne('patient-id');

      expect(result.id).toBe(mockPatient.id);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when patient does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a patient', async () => {
      const dto: UpdatePatientDto = {
        givenName: 'Jane',
      };

      repository.findOneBy.mockResolvedValue(mockPatient);

      repository.findOne.mockResolvedValue(null);

      repository.save.mockResolvedValue({
        ...mockPatient,
        ...dto,
      });

      const result = await service.update('patient-id', dto);

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(result.givenName).toBe('Jane');

      expect(logger.info).toHaveBeenCalledWith(
        'Updated patient with id patient-id',
      );
    });

    it('should throw NotFoundException if patient does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.update('missing-id', {})).rejects.toThrow(
        NotFoundException,
      );

      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw ConflictException if updated patient already exists', async () => {
      repository.findOneBy.mockResolvedValue(mockPatient);

      repository.findOne.mockResolvedValue(mockPatient);

      await expect(
        service.update('patient-id', {
          givenName: 'John',
        }),
      ).rejects.toThrow(ConflictException);

      expect(repository.save).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a patient', async () => {
      repository.delete.mockResolvedValue({
        affected: 1,
        raw: {},
      });

      const result = await service.remove('patient-id');

      expect(repository.delete).toHaveBeenCalledWith('patient-id');

      expect(result).toEqual({
        id: 'patient-id',
        deleted: true,
      });

      expect(logger.info).toHaveBeenCalledWith(
        'Deleted patient with id patient-id',
      );
    });

    it('should throw NotFoundException when patient does not exist', async () => {
      repository.delete.mockResolvedValue({
        affected: 0,
        raw: {},
      });

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
