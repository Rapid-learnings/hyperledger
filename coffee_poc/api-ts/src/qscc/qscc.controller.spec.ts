import { Test, TestingModule } from '@nestjs/testing';
import { QsccController } from './qscc.controller';

describe('QsccController', () => {
  let controller: QsccController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QsccController],
    }).compile();

    controller = module.get<QsccController>(QsccController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
