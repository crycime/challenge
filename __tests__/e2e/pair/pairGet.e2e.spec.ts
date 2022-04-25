import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import * as mockingoose from 'mockingoose';
import RedisMock from 'ioredis-mock';
import {
  generateSequentialTests,
  mockGenericApp,
  pairTestModel,
} from '../../helper/e2e.helper';
import { PairModule } from '../../../src/modules/pair/pair.module';
import { PairRepository } from '../../../src/modules/pair/repository/pair.repository';
import { RedisClientService } from '../../../src/modules/redis/redisClient.service';
import { PairHandlerService } from '../../../src/modules/pair/services/pair.handler.service';
import {
  PairSchema,
  pairValidExample,
} from '../../../src/modules/pair/schema/pair.schema';
import { RedisService } from 'nestjs-redis';
import { pairListRedisKey } from '../../../src/utils/redis.util';
import { PairController } from '../../../src/modules/pair/controllers/pair.controller';
import { MongooseModule } from '@nestjs/mongoose';

const path = '/pair';

describe(`GET ${path}`, () => {
  let app: INestApplication;
  let pairHandlerService;
  let pairRepository: PairRepository;
  let redisClientService: RedisClientService;
  let mockRedis: RedisMock;
  let mockFunctionGroup;

  beforeAll(async () => {
    mockRedis = new RedisMock();
    jest
      .spyOn(RedisService.prototype, 'getClient')
      .mockImplementation(() => mockRedis);
    const mockRedisService = {
      getClient: jest.fn(() => mockRedis),
    };
    const appModule = (
      await mockGenericApp({
        module: {
          imports: [
            MongooseModule.forFeature([{ name: 'pair', schema: PairSchema }]),
          ],
          controllers: [PairController],
          providers: [
            PairHandlerService,
            PairRepository,
            { provide: RedisService, useValue: mockRedisService },
            RedisClientService,
          ],
        },
      })
    ).createNestApplication();
    pairHandlerService =
      appModule.get<PairHandlerService>('PairHandlerService');
    pairRepository = appModule.get<PairRepository>('PairRepository');
    redisClientService =
      appModule.get<RedisClientService>('RedisClientService');
    mockFunctionGroup = {
      spyHandlerGetPairList: jest
        .spyOn(pairHandlerService, 'getPairList')
        .mockName('spyHandlerGetPairList'),
      spyRedisGet: jest
        .spyOn(redisClientService, 'get')
        .mockName('spyRedisGet'),
      spyPairRepositoryFind: jest
        .spyOn(pairRepository, 'find')
        .mockName('spyPairRepositoryFind'),
      spyRedisSet: jest
        .spyOn(redisClientService, 'set')
        .mockName('spyRedisSet'),
    };
    app = await appModule.init();
  });

  describe('success cases', () => {
    it('should return pair list response with cache', async () => {
      mockRedis.set(pairListRedisKey(), JSON.stringify([pairValidExample]));
      // mockingoose(pairTestModel).toReturn([pairValidExample], 'find');
      const response = await request(app.getHttpServer()).get(path);
      expect(response.status).toEqual(HttpStatus.OK);
      generateSequentialTests({
        mockFunctionGroup,
        apiResponse: response,
        snapshots: ['spyHandlerGetPairList', 'spyRedisGet'],
        notCalled: ['spyPairRepositoryFind', 'spyRedisSet'],
      });
    });
    it('should return pair list response with no cache', async () => {
      mockingoose(pairTestModel).toReturn([pairValidExample], 'find');
      const response = await request(app.getHttpServer()).get(path);
      expect(response.status).toEqual(HttpStatus.OK);
      generateSequentialTests({
        mockFunctionGroup,
        apiResponse: response,
        snapshots: [
          'spyHandlerGetPairList',
          'spyRedisGet',
          'spyPairRepositoryFind',
          'spyRedisSet',
        ],
      });
    });
  });

  describe('fail cases', () => {
    it('should throw MongoResponse Error if Model find fail', async () => {
      mockingoose(pairTestModel).toReturn(new Error('My Error'), 'find');
      const response = await request(app.getHttpServer()).get(path);
      expect(response.status).toEqual(HttpStatus.BAD_GATEWAY);
      generateSequentialTests({
        mockFunctionGroup,
        apiResponse: response,
        snapshots: [
          'spyHandlerGetPairList',
          'spyRedisGet',
          'spyPairRepositoryFind',
        ],
        notCalled: ['spyRedisSet'],
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockingoose.resetAll();
    mockRedis.data.clear();
  });

  afterAll(async () => {
    await app.close();
  });
});
