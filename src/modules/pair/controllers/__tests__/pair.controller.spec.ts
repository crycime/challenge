import { PairController } from '../pair.controller';
import { pairValidExample } from '../../schema/pair.schema';

describe('PairController', () => {
  let pairController: PairController;
  let mockPairHandlerService;
  let generatePairController;

  beforeAll(() => {
    generatePairController = () => new PairController(mockPairHandlerService);
  });

  beforeEach(() => {
    mockPairHandlerService = {};
  });

  describe('GET /', () => {
    const res = {
      set: jest.fn(),
      send: jest.fn(),
    } as any;
    it('should return pair list', async () => {
      mockPairHandlerService = {
        getPairList: jest.fn(() => [pairValidExample]),
      };
      pairController = generatePairController();
      const res = await pairController.getPairList();
      expect(mockPairHandlerService.getPairList).toBeCalled();
      expect(res).toEqual([pairValidExample]);
    });
  });
});
