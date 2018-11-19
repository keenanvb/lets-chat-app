const expect = require('expect');

const {isString} = require('./validation');

describe('isString', () => {
  it('should reject non-string values', () => {
    var res = isString(98);
    expect(res).toBe(false);
  });

  it('should reject string with only spaces', () => {
    var res = isString('    ');
    expect(res).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    var res = isString('D');
    expect(res).toBe(true);
  });
});