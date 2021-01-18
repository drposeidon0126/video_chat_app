import { Test, TestingModule } from '@nestjs/testing';
import { NegotiateGateway } from './negotiate.gateway';

describe('NegotiateGateway', () => {
  let gateway: NegotiateGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NegotiateGateway],
    }).compile();

    gateway = module.get<NegotiateGateway>(NegotiateGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
