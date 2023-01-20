import { Test, TestingModule } from '@nestjs/testing';
import { MwccController } from './mwcc.controller';

describe('MwccController', () => {
  let controller: MwccController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MwccController],
    }).compile();

    controller = module.get<MwccController>(MwccController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
