import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },

  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 10, b: 20, action: Action.Subtract, expected: -10 },

  { a: 4, b: 5, action: Action.Multiply, expected: 20 },
  { a: 7, b: 0, action: Action.Multiply, expected: 0 },

  { a: 8, b: 2, action: Action.Divide, expected: 4 },
  { a: 9, b: 3, action: Action.Divide, expected: 3 },

  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 0, action: Action.Exponentiate, expected: 1 },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'returns $expected for $a $action $b',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );

  test('returns null for invalid action', () => {
    const result = simpleCalculator({ a: 2, b: 3, action: '%' });
    expect(result).toBeNull();
  });

  test('returns null when "a" is not a number', () => {
    const result = simpleCalculator({ a: '2', b: 3, action: Action.Add });
    expect(result).toBeNull();
  });

  test('returns null when "b" is not a number', () => {
    const result = simpleCalculator({ a: 2, b: '3', action: Action.Add });
    expect(result).toBeNull();
  });

  test('returns null when both "a" and "b" are invalid', () => {
    const result = simpleCalculator({ a: 'x', b: null, action: Action.Multiply });
    expect(result).toBeNull();
  });
});
