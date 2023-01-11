import { Test, TestingModule } from '@nestjs/testing';
import { QsccService } from './qscc.service';

describe('QsccService', () => {
  let service: QsccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QsccService],
    }).compile();

    service = module.get<QsccService>(QsccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
