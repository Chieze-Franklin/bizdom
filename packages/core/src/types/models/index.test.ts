import { isID } from ".";

describe('Core', () => {
  it('should mark a number as ID', () => {
    expect(isID(1)).toBeTruthy();
  });

  it('should mark a string as ID', () => {
    expect(isID('1')).toBeTruthy();
  });

  it('should not mark objects, boolean, functions, undefined as ID', () => {
    expect(isID(true)).toBeFalsy();
    expect(isID(() => {})).toBeFalsy();
    expect(isID({})).toBeFalsy();
    expect(isID(undefined)).toBeFalsy();
  });
});
