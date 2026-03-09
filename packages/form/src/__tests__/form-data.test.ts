import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { formDataToRedisplayValues, formDataToValues } from '../form-data';

describe('zfd.formData parsing (values)', () => {
  it('parses single values as strings', () => {
    const fd = new FormData();
    fd.set('name', 'Alice');

    const schema = zfd.formData({
      name: zfd.text()
    });

    expect(schema.parse(fd)).toEqual({ name: 'Alice' });
  });

  it('parses repeated entries into arrays', () => {
    const fd = new FormData();
    fd.append('tag', 'a');
    fd.append('tag', 'b');

    const schema = zfd.formData({
      tag: zfd.repeatable()
    });

    expect(schema.parse(fd)).toEqual({ tag: ['a', 'b'] });
  });

  it('keeps strings for boolean/number inputs (FormData stores strings)', () => {
    const fd = new FormData();
    fd.set('enabled', true as unknown as string);
    fd.set('count', 3 as unknown as string);

    const schema = zfd.formData({
      enabled: zfd.text(),
      count: zfd.text()
    });

    expect(schema.parse(fd)).toEqual({ enabled: 'true', count: '3' });
  });

  it('coerces booleans and numbers when using zfd.checkbox/zfd.numeric', () => {
    const fd = new FormData();
    fd.set('enabled', 'on');
    fd.set('count', '3');

    const schema = zfd.formData({
      enabled: zfd.checkbox(),
      count: zfd.numeric()
    });

    expect(schema.parse(fd)).toEqual({ enabled: true, count: 3 });
  });

  it('mixes single and multiple keys', () => {
    const fd = new FormData();
    fd.set('name', 'Bob');
    fd.append('tag', 'x');
    fd.append('tag', 'y');

    const schema = zfd.formData({
      name: zfd.text(),
      tag: zfd.repeatable()
    });

    expect(schema.parse(fd)).toEqual({ name: 'Bob', tag: ['x', 'y'] });
  });

  it('builds arrays of objects from bracket paths', () => {
    const fd = new FormData();
    fd.set('levels[0].title', 'Intro');
    fd.set('levels[0].description', 'Basics');
    fd.set('levels[1].title', 'Advanced');
    fd.set('levels[1].description', 'Deep dive');

    const schema = zfd.formData({
      levels: zfd.repeatable(
        z.array(
          z.object({
            title: zfd.text(),
            description: zfd.text()
          })
        )
      )
    });

    expect(schema.parse(fd)).toEqual({
      levels: [
        { title: 'Intro', description: 'Basics' },
        { title: 'Advanced', description: 'Deep dive' }
      ]
    });
  });

  it('parses files as File instances when using zfd.file', () => {
    const fd = new FormData();
    fd.set('title', 'Badge');
    fd.set('levels[0].title', 'Intro');
    fd.set('levels[0].description', 'Basics');
    fd.append('tag', 'a');
    fd.append('tag', 'b');
    fd.set('enabled', 'on');
    fd.set('image', new File(['payload'], 'logo.png', { type: 'image/png' }));

    const schema = zfd.formData({
      title: zfd.text(),
      levels: zfd.repeatable(
        z.array(
          z.object({
            title: zfd.text(),
            description: zfd.text()
          })
        )
      ),
      tag: zfd.repeatable(),
      enabled: zfd.text(),
      image: zfd.file()
    });

    expect(schema.parse(fd)).toEqual({
      title: 'Badge',
      levels: [{ title: 'Intro', description: 'Basics' }],
      tag: ['a', 'b'],
      enabled: 'on',
      image: expect.any(File)
    });
  });
});

describe('formDataToValues', () => {
  it('drops File values by default', () => {
    const fd = new FormData();
    fd.set('title', 'Badge');
    fd.set('image', new File(['payload'], 'logo.png', { type: 'image/png' }));

    const schema = zfd.formData({
      title: zfd.text(),
      image: zfd.file()
    });

    expect(formDataToValues(fd, schema)).toEqual({
      title: 'Badge',
      image: undefined
    });
  });

  it('keeps File values when dropFiles is false', () => {
    const fd = new FormData();
    fd.set('title', 'Badge');
    fd.set('image', new File(['payload'], 'logo.png', { type: 'image/png' }));

    const schema = zfd.formData({
      title: zfd.text(),
      image: zfd.file()
    });

    expect(formDataToValues(fd, schema, { dropFiles: false })).toEqual({
      title: 'Badge',
      image: expect.any(File)
    });
  });
});

describe('formDataToRedisplayValues', () => {
  it('preserves user input for invalid fields and nested bracket paths', () => {
    const fd = new FormData();
    fd.set('name', 'A');
    fd.set('levels[0].title', 'Niveau 1');
    fd.set('levels[0].description', 'Desc 1');
    fd.set('levels[1].title', 'Niveau 2');
    fd.set('levels[1].description', 'Desc 2');

    const previousValues = {
      name: '',
      levels: [{ title: '', description: '' }]
    };

    expect(formDataToRedisplayValues(fd, previousValues)).toEqual({
      name: 'A',
      levels: [
        { title: 'Niveau 1', description: 'Desc 1' },
        { title: 'Niveau 2', description: 'Desc 2' }
      ]
    });
  });

  it('does not resurrect removed repeated items when redisplaying invalid form data', () => {
    const fd = new FormData();
    fd.set('name', 'A');
    fd.set('levels[0].title', 'Niveau 1');
    fd.set('levels[0].description', 'Desc 1');
    fd.set('levels[1].title', 'Niveau 2');
    fd.set('levels[1].description', 'Desc 2');

    const previousValues = {
      name: '',
      levels: [
        { title: 'Old 1', description: 'Old Desc 1' },
        { title: 'Old 2', description: 'Old Desc 2' },
        { title: 'Should be removed', description: 'Should be removed' }
      ]
    };

    expect(formDataToRedisplayValues(fd, previousValues)).toEqual({
      name: 'A',
      levels: [
        { title: 'Niveau 1', description: 'Desc 1' },
        { title: 'Niveau 2', description: 'Desc 2' }
      ]
    });
  });

  it('resets unchecked checkbox-like values', () => {
    const fd = new FormData();
    fd.set('email', 'user@example.com');

    const previousValues = {
      email: '',
      terms: 'on',
      activationEnabled: true
    };

    expect(formDataToRedisplayValues(fd, previousValues)).toEqual({
      email: 'user@example.com',
      terms: '',
      activationEnabled: false
    });
  });
});
