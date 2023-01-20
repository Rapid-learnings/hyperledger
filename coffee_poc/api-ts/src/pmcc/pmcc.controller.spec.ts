import { Test, TestingModule } from '@nestjs/testing';
import { PmccController } from './pmcc.controller';

describe('PmccController', () => {
  let controller: PmccController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PmccController],
    }).compile();

    controller = module.get<PmccController>(PmccController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
