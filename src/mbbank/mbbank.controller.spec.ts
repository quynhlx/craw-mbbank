import { Test, TestingModule } from '@nestjs/testing';
import { MbbankController } from './mbbank.controller';

describe('MbbankController', () => {
  let controller: MbbankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MbbankController],
    }).compile();

    controller = module.get<MbbankController>(MbbankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
