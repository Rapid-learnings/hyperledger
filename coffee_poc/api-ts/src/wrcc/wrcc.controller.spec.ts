import { Test, TestingModule } from '@nestjs/testing';
import { WrccController } from './wrcc.controller';

describe('WrccController', () => {
  let controller: WrccController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WrccController],
    }).compile();

    controller = module.get<WrccController>(WrccController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
