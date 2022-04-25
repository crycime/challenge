import { pairListRedisKey } from '../../../../utils/redis.util';
import { PairProcessor } from '../pair.processor';

describe('PairProcessor', () => {
  let pairProcessor: PairProcessor;
  let mockLoggerService;
  let mockComicsService;
  let mockPairRepository;
  let mockRedisClientService;
  let generatePairProcessor;

  beforeAll(() => {
    generatePairProcessor = () =>
      new PairProcessor(
        mockLoggerService,
        mockComicsService,
        mockPairRepository,
        mockRedisClientService,
      );
  });

  beforeEach(() => {
    mockLoggerService = {};
    mockComicsService = {};
    mockPairRepository = {};
    mockRedisClientService = {};
  });

  describe('handlePairStatistics', () => {
    it('should handle Pair Statistics', async () => {
      mockLoggerService = {
        debug: jest.fn(),
      };
      mockRedisClientService = {
        del: jest.fn(),
      };
      mockComicsService = {
        currenciesTicker: jest.fn(() => [
          {
            name: 'Dash',
            currency: 'DASH',
            price: '94.43988779',
            '1h': { volume: '14842550.99', price_change: '-2.01721443' },
          },
        ]),
      };
      mockPairRepository = {
        bulkWrite: jest.fn(),
      };
      pairProcessor = generatePairProcessor();
      await pairProcessor.handlePairStatistics({
        data: {},
      } as any);
      expect(mockLoggerService.debug).toHaveBeenCalledTimes(2);
      expect(mockLoggerService.debug).toHaveBeenNthCalledWith(
        1,
        'Start job...',
      );
      expect(mockLoggerService.debug).toHaveBeenNthCalledWith(2, {});
      expect(mockRedisClientService.del).toHaveBeenCalledTimes(2);
      expect(mockRedisClientService.del).toHaveBeenNthCalledWith(
        1,
        pairListRedisKey(),
      );
      expect(mockComicsService.currenciesTicker).toHaveBeenCalledWith({
        ids: 'BTC,ETH,LTC,XMR,XRP,DOGE,DASH,MAID,LSK,SJCX',
        convert: 'USD',
      });
      expect(mockPairRepository.bulkWrite).toHaveBeenCalledWith([
        {
          updateOne: {
            filter: {
              name: 'Dash',
            },
            update: {
              name: 'Dash',
              currency: 'DASH',
              convert: 'USD',
              price: '94.43988779',
              volume: '14842550.99',
              price_change: '-2.01721443',
            },
            upsert: true,
          },
        },
      ]);
      expect(mockRedisClientService.del).toHaveBeenNthCalledWith(
        2,
        pairListRedisKey(),
      );
    });
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });
});
