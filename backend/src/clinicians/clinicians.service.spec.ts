import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

import { CliniciansService } from './clinicians.service';
import { Clinician } from './entities/clinician.entity';
import {
  CreateClinicianRequestDto,
  UpdateClinicianDto,
} from './dto/clinician-crud.dto';
import { Gender } from 'src/common/enums/gender.enum';
import { SortDirection } from 'src/common/enums/sortDirection.enum';

describe('CliniciansService', () => {
  let service: CliniciansService;
  let repository: jest.Mocked<Repository<Clinician>>;
  let logger: jest.Mocked<PinoLogger>;

  const mockClinician: Clinician = {
    id: 'clinician-id',
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
        CliniciansService,
        {
          provide: getRepositoryToken(Clinician),
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

    service = module.get<CliniciansService>(CliniciansService);
    repository = module.get(getRepositoryToken(Clinician));
    logger = module.get(PinoLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a clinician', async () => {
      const dto: CreateClinicianRequestDto = {
        givenName: 'John',
        familyName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: Gender.male,
      };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(mockClinician);
      repository.save.mockResolvedValue(mockClinician);

      const result = await service.create(dto);

      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
      expect(result.id).toBe(mockClinician.id);

      expect(logger.info).toHaveBeenCalledWith(
        `Clinician created: ${mockClinician.id}`,
      );
    });

    it('should throw ConflictException if clinician already exists', async () => {
      const dto: CreateClinicianRequestDto = {
        givenName: 'John',
        familyName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: Gender.male,
      };

      repository.findOne.mockResolvedValue(mockClinician);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return clinician', async () => {
      repository.findOne.mockResolvedValue(mockClinician);

      const result = await service.findOne('clinician-id');

      expect(result.id).toBe(mockClinician.id);
    });

    it('should throw NotFoundException when clinician does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated clinicians', async () => {
      repository.findAndCount.mockResolvedValue([[mockClinician], 1]);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        sortBy: SortDirection.ASC,
      });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('update', () => {
    it('should update clinician', async () => {
      const dto: UpdateClinicianDto = {
        givenName: 'Jane',
      };

      repository.findOneBy.mockResolvedValue(mockClinician);

      repository.findOne.mockResolvedValue(null);

      repository.save.mockResolvedValue({
        ...mockClinician,
        ...dto,
      });

      const result = await service.update('clinician-id', dto);

      expect(repository.save).toHaveBeenCalled();
      expect(result.givenName).toBe('Jane');
    });

    it('should throw NotFoundException if clinician does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.update('missing-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if updated clinician already exists', async () => {
      repository.findOneBy.mockResolvedValue(mockClinician);

      repository.findOne.mockResolvedValue(mockClinician);

      await expect(
        service.update('clinician-id', {
          givenName: 'John',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete clinician', async () => {
      repository.delete.mockResolvedValue({
        affected: 1,
        raw: {},
      });

      const result = await service.remove('clinician-id');

      expect(repository.delete).toHaveBeenCalledWith('clinician-id');

      expect(result).toEqual({
        id: 'clinician-id',
        deleted: true,
      });
    });

    it('should throw NotFoundException if clinician does not exist', async () => {
      repository.delete.mockResolvedValue({
        affected: 0,
        raw: {},
      });

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
