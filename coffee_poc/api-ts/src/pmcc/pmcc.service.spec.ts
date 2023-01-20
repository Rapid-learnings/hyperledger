import { Test, TestingModule } from '@nestjs/testing';
import { PmccService } from './pmcc.service';

describe('PmccService', () => {
  let service: PmccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmccService],
    }).compile();

    service = module.get<PmccService>(PmccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
