import { Test, TestingModule } from '@nestjs/testing';
import { WrccService } from './wrcc.service';

describe('WrccService', () => {
  let service: WrccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WrccService],
    }).compile();

    service = module.get<WrccService>(WrccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
