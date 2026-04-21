import type { AbstractIntlMessages } from 'next-intl';

function getNestedValue(messages: AbstractIntlMessages, path: string): unknown {
  return path.split('.').reduce<unknown>((currentValue, segment) => {
    if (!currentValue || typeof currentValue !== 'object') {
      return undefined;
    }

    return (currentValue as Record<string, unknown>)[segment];
  }, messages);
}

function setNestedValue(target: Record<string, unknown>, path: string, value: unknown): void {
  const segments = path.split('.');
  let currentTarget = target;

  segments.forEach((segment, index) => {
    const isLeaf = index === segments.length - 1;
    if (isLeaf) {
      currentTarget[segment] = value;
      return;
    }

    const nextValue = currentTarget[segment];
    if (!nextValue || typeof nextValue !== 'object' || Array.isArray(nextValue)) {
      currentTarget[segment] = {};
    }
    currentTarget = currentTarget[segment] as Record<string, unknown>;
  });
}

export function pickMessages(messages: AbstractIntlMessages, paths: string[]): AbstractIntlMessages {
  const pickedMessages: Record<string, unknown> = {};

  paths.forEach((path) => {
    const value = getNestedValue(messages, path);
    if (value !== undefined) {
      setNestedValue(pickedMessages, path, value);
    }
  });

  return pickedMessages as AbstractIntlMessages;
}
