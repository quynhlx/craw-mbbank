import { Test, TestingModule } from '@nestjs/testing';
import { MbbankService } from './mbbank.service';

describe('MbbankService', () => {
  let service: MbbankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MbbankService],
    }).compile();

    service = module.get<MbbankService>(MbbankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
