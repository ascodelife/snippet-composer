import { Snippet } from '@/types';
import { mergeSnippet } from '@/utils';

describe('Utils cases', () => {
  test('mergeSnippet', () => {
    const snippet1: Snippet = {
      a: {
        prefix: ['a'],
        body: ['a1', 'a2'],
      },
      b: {
        prefix: ['b'],
        body: ['b1', 'b2'],
      },
    };
    const snippet2: Snippet = {
      c: {
        prefix: ['c'],
        body: ['c1', 'c2'],
      },
      d: {
        prefix: ['d'],
        body: ['d1', 'd2'],
      },
      e: {
        prefix: ['e'],
        body: 'e',
      },
    };
    const bodyRecord = mergeSnippet([snippet1, snippet2]);
    expect(bodyRecord).toEqual({
      a: ['a1', 'a2'],
      b: ['b1', 'b2'],
      c: ['c1', 'c2'],
      d: ['d1', 'd2'],
      e: ['e'],
    });
    expect(() => mergeSnippet([snippet1, snippet1])).toThrow(
      Error('Duplicate snippet name a'),
    );
  });
});
