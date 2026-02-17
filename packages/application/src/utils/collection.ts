export const uniqueBy = <Item, Key>(items: Item[], key: (item: Item) => Key): Item[] => {
  const map = new Map<Key, Item>();
  items.forEach((item) => {
    map.set(key(item), item);
  });
  return Array.from(map.values());
};

export const uniqueValues = <Value>(values: Value[] | undefined): Value[] => {
  if (!values?.length) return [];
  return Array.from(new Set(values));
};

export const uniqueValuesWithout = <Value>(values: Value[] | undefined, value?: Value): Value[] => {
  const unique = uniqueValues(values);
  if (value === undefined) return unique;
  return unique.filter((item) => item !== value);
};

export const excludeBy = <Item, Key>(items: Item[] | undefined, key: (item: Item) => Key, excluded?: Key): Item[] => {
  if (!items?.length) return [];
  if (excluded === undefined) return items;
  return items.filter((item) => key(item) !== excluded);
};
