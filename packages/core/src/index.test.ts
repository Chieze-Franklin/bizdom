import { isID } from '.';

describe('Core', () => {
  it('should mark a number as ID', () => {
    expect(isID(1)).toBeTruthy();
  });
});
