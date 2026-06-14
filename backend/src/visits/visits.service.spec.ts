import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

import { VisitsService } from './visits.service';
import { Visit } from './entities/visit.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Clinician } from 'src/clinicians/entities/clinician.entity';
import { Gender } from 'src/common/enums/gender.enum';

describe('VisitsService', () => {
  let service: VisitsService;

  let visitsRepository: jest.Mocked<Repository<Visit>>;
  let patientsRepository: jest.Mocked<Repository<Patient>>;
  let cliniciansRepository: jest.Mocked<Repository<Clinician>>;
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

  const mockClinician: Clinician = {
    id: 'clinician-id',
    givenName: 'Jane',
    familyName: 'Smith',
    dateOfBirth: new Date('1985-01-01'),
    gender: Gender.female,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    visits: [],
  };

  const mockVisit: Visit = {
    id: 'visit-id',
    patientId: mockPatient.id,
    clinicianId: mockClinician.id,
    patient: mockPatient,
    clinician: mockClinician,
    visitedAt: new Date('2025-01-01T10:00:00Z'),
    notes: 'Routine follow-up visit.',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitsService,
        {
          provide: getRepositoryToken(Visit),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            findOneOrFail: jest.fn(),
            findAndCount: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Patient),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Clinician),
          useValue: {
            findOneBy: jest.fn(),
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

    service = module.get<VisitsService>(VisitsService);

    visitsRepository = module.get(getRepositoryToken(Visit));
    patientsRepository = module.get(getRepositoryToken(Patient));
    cliniciansRepository = module.get(getRepositoryToken(Clinician));
    logger = module.get(PinoLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a visit', async () => {
      const dto = {
        patientId: mockPatient.id,
        clinicianId: mockClinician.id,
        visitedAt: new Date(),
        notes: 'Patient improving.',
      };

      patientsRepository.findOneBy.mockResolvedValue(mockPatient);
      cliniciansRepository.findOneBy.mockResolvedValue(mockClinician);

      visitsRepository.findOne.mockResolvedValue(null);
      visitsRepository.create.mockReturnValue(mockVisit);
      visitsRepository.save.mockResolvedValue(mockVisit);
      visitsRepository.findOneOrFail.mockResolvedValue(mockVisit);

      const result = await service.create(dto);

      expect(result.id).toBe(mockVisit.id);
      expect(visitsRepository.save).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw when patient does not exist', async () => {
      patientsRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.create({
          patientId: 'missing',
          clinicianId: mockClinician.id,
          visitedAt: new Date(),
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw when clinician does not exist', async () => {
      patientsRepository.findOneBy.mockResolvedValue(mockPatient);
      cliniciansRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.create({
          patientId: mockPatient.id,
          clinicianId: 'missing',
          visitedAt: new Date(),
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw on duplicate visit', async () => {
      patientsRepository.findOneBy.mockResolvedValue(mockPatient);

      cliniciansRepository.findOneBy.mockResolvedValue(mockClinician);

      visitsRepository.findOne.mockResolvedValue(mockVisit);

      await expect(
        service.create({
          patientId: mockPatient.id,
          clinicianId: mockClinician.id,
          visitedAt: mockVisit.visitedAt,
          notes: mockVisit.notes,
        }),
      ).rejects.toThrow(ConflictException);

      expect(visitsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated visits', async () => {
      visitsRepository.findAndCount.mockResolvedValue([[mockVisit], 1]);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      });

      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a visit', async () => {
      visitsRepository.findOne.mockResolvedValue(mockVisit);

      const result = await service.findOne(mockVisit.id);

      expect(result.id).toBe(mockVisit.id);
    });

    it('should throw when visit does not exist', async () => {
      visitsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a visit', async () => {
      visitsRepository.findOneBy.mockResolvedValue(mockVisit);

      visitsRepository.findOne.mockResolvedValue(null);

      visitsRepository.save.mockResolvedValue(mockVisit);

      visitsRepository.findOneOrFail.mockResolvedValue(mockVisit);

      const result = await service.update(mockVisit.id, {
        notes: 'Updated notes',
      });

      expect(result.id).toBe(mockVisit.id);
      expect(visitsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw when visit does not exist', async () => {
      visitsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('missing', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw when patient does not exist', async () => {
      visitsRepository.findOneBy.mockResolvedValue(mockVisit);

      patientsRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(mockVisit.id, {
          patientId: 'missing',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw when clinician does not exist', async () => {
      visitsRepository.findOneBy.mockResolvedValue(mockVisit);

      cliniciansRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(mockVisit.id, {
          clinicianId: 'missing',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw on duplicate visit', async () => {
      const duplicateVisit = {
        ...mockVisit,
        id: 'another-visit-id',
        notes: 'duplicate',
      };

      visitsRepository.findOneBy.mockResolvedValue(mockVisit);

      visitsRepository.findOne.mockResolvedValue(duplicateVisit);

      await expect(
        service.update(mockVisit.id, {
          notes: 'duplicate',
        }),
      ).rejects.toThrow(ConflictException);

      expect(visitsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a visit', async () => {
      visitsRepository.delete.mockResolvedValue({
        affected: 1,
        raw: {},
      });

      const result = await service.remove(mockVisit.id);

      expect(result).toEqual({
        id: mockVisit.id,
        deleted: true,
      });
    });

    it('should throw when visit does not exist', async () => {
      visitsRepository.delete.mockResolvedValue({
        affected: 0,
        raw: {},
      });

      await expect(service.remove('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
