import { Test, TestingModule } from '@nestjs/testing';
import { MwccService } from './mwcc.service';

describe('MwccService', () => {
  let service: MwccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MwccService],
    }).compile();

    service = module.get<MwccService>(MwccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
