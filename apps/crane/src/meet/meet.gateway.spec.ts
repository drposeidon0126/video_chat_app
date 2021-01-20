import { Test, TestingModule } from '@nestjs/testing';
import { MeetGateway } from './meet.gateway';

describe('MeetGateway', () => {
  let gateway: MeetGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetGateway],
    }).compile();

    gateway = module.get<MeetGateway>(MeetGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
