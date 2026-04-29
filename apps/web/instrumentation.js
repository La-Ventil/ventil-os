const normalizeUrl = (value) => value.replace(/\/$/, '');

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const uptraceDsn = process.env.UPTRACE_DSN;
  if (!uptraceDsn) {
    return;
  }

  process.env.OTEL_SERVICE_NAME ||= 'ventilos-web';
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||= `${normalizeUrl(process.env.UPTRACE_SITE_URL || 'http://localhost:14318')}/v1/traces`;
  process.env.OTEL_EXPORTER_OTLP_HEADERS ||= `uptrace-dsn=${uptraceDsn}`;

  const { registerOTel } = await import('@vercel/otel');
  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME,
    traceExporter: 'otlp-http'
  });
}
