import { parseDescription } from '../swagger.util';

describe('parseDescription', () => {
  it('should return correct string', () => {
    const result = parseDescription({
      keyPts: ['first line', 'second line'],
      diagram: 'test graph',
    });
    expect(result).toEqual(
      '__Key Points__:\n- first line\n- second line\n\n __Sequence Diagram__:\n\ntest graph',
    );
  });
  it('should return correct string without diagram', () => {
    const result = parseDescription({
      keyPts: ['first line', 'second line'],
    });
    expect(result).toEqual('__Key Points__:\n- first line\n- second line');
  });
});
