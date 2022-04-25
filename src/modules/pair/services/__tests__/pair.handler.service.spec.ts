import { PairHandlerService } from '../pair.handler.service';
import { pairValidExample } from '../../schema/pair.schema';
import { pairListRedisKey } from '../../../../utils/redis.util';

describe('PairHandlerService', () => {
  let pairHandlerService: PairHandlerService;
  let mockPairRepository;
  let mockRedisClientService;
  let generatePairHandlerService;

  beforeAll(() => {
    generatePairHandlerService = () =>
      new PairHandlerService(mockPairRepository, mockRedisClientService);
  });

  beforeEach(() => {
    mockPairRepository = {};
    mockRedisClientService = {};
  });

  describe('getPairList', () => {
    it('should return pair list with cache', async () => {
      mockRedisClientService = {
        get: jest.fn(() => [pairValidExample]),
      };
      mockPairRepository = {
        find: jest.fn(() => [pairValidExample]),
      };
      pairHandlerService = generatePairHandlerService();
      const result = await pairHandlerService.getPairList();
      expect(mockRedisClientService.get).toHaveBeenCalledWith(
        pairListRedisKey(),
      );
      expect(mockPairRepository.find).not.toBeCalled();
      expect(result).toEqual([pairValidExample]);
    });
    it('should return pair list with no cache', async () => {
      mockRedisClientService = {
        get: jest.fn(() => undefined),
        set: jest.fn(),
      };
      mockPairRepository = {
        find: jest.fn(() => [pairValidExample]),
      };
      pairHandlerService = generatePairHandlerService();
      const result = await pairHandlerService.getPairList();
      expect(mockRedisClientService.get).toBeCalled();
      expect(mockPairRepository.find).toHaveBeenCalledWith({ filter: {} });
      expect(mockRedisClientService.set).toHaveBeenCalledWith({
        key: pairListRedisKey(),
        value: JSON.stringify([pairValidExample]),
      });
      expect(result).toEqual([pairValidExample]);
    });
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });
});
