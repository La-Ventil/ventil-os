import { describe, it, expect } from 'vitest';
import { formDataToStringRecord } from '../form-data';

describe('formDataToStringRecord', () => {
  it('returns single values as string', () => {
    const fd = new FormData();
    fd.set('name', 'Alice');

    expect(formDataToStringRecord(fd)).toEqual({ name: 'Alice' });
  });

  it('keeps multiple entries as an array', () => {
    const fd = new FormData();
    fd.append('tag', 'a');
    fd.append('tag', 'b');

    expect(formDataToStringRecord(fd)).toEqual({ tag: ['a', 'b'] });
  });

  it('stringifies non-string entries', () => {
    const fd = new FormData();
    fd.set('num', '42');
    fd.set('bool', 'true');

    expect(formDataToStringRecord(fd)).toEqual({ num: '42', bool: 'true' });
  });

  it('mixes single and multiple keys', () => {
    const fd = new FormData();
    fd.set('name', 'Bob');
    fd.append('tag', 'x');
    fd.append('tag', 'y');

    expect(formDataToStringRecord(fd)).toEqual({ name: 'Bob', tag: ['x', 'y'] });
  });
});
