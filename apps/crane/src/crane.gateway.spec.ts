import { Test, TestingModule } from '@nestjs/testing';
import { CraneGateway } from './crane.gateway';

describe('CraneGateway', () => {
  let gateway: CraneGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CraneGateway],
    }).compile();

    gateway = module.get<CraneGateway>(CraneGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
