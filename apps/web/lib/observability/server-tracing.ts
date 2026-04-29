import { SpanStatusCode, trace, type Attributes, type AttributeValue } from '@opentelemetry/api';

type SpanAttributeValue = AttributeValue | undefined;
type SpanAttributes = Record<string, SpanAttributeValue>;

const tracer = trace.getTracer('ventilos-web');

const compactAttributes = (attributes: SpanAttributes): Attributes => {
  const compacted: Attributes = {};

  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      compacted[key] = value;
    }
  }

  return compacted;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
};

export async function traceServerOperation<T>(
  name: string,
  attributes: SpanAttributes,
  operation: () => Promise<T>
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    tracer.startActiveSpan(name, { attributes: compactAttributes(attributes) }, async (span) => {
      try {
        resolve(await operation());
      } catch (error) {
        span.recordException(error instanceof Error ? error : new Error(String(error)));
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: getErrorMessage(error)
        });
        reject(error);
      } finally {
        span.end();
      }
    });
  });
}
