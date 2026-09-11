// Summarize Clever Cloud host metrics (Warp 10) for one application.
// Usage: pnpm metrics [--hours N]
// Reads WARP10_* and CLEVER_APP_ID from apps/web/.env; shell variables win (CLEVER_APP_ID=app_… pnpm metrics).
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MICROS_PER_SECOND = 1_000_000;
const PEAK_COUNT = 5;

const toMiB = (value) => value / 1024 / 1024;

const METRICS = [
  { selector: 'cpu.usage_idle', label: 'cpu busy %', map: (value) => 100 - value, peaks: true, cpuTotal: true },
  { selector: 'cpu.usage_steal', label: 'cpu steal %', cpuTotal: true },
  { selector: 'cpu.usage_iowait', label: 'cpu iowait %', peaks: true, cpuTotal: true },
  { selector: 'mem.total', label: 'mem total MiB', map: toMiB },
  { selector: 'mem.used_percent', label: 'mem used %', peaks: true },
  { selector: 'mem.available', label: 'mem available MiB', map: toMiB },
  { selector: 'swap.used_percent', label: 'swap used %' },
  { selector: 'net.bytes_recv', label: 'net recv KiB/s', map: (value) => value / 1024, counter: true }
];

const loadEnv = () => {
  try {
    process.loadEnvFile(path.join(repoRoot, 'apps/web/.env'));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  const missing = ['WARP10_ENDPOINT', 'WARP10_READ_TOKEN', 'CLEVER_APP_ID'].filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing ${missing.join(', ')} in apps/web/.env (see apps/web/.env.example).`);
    process.exit(1);
  }

  return {
    endpoint: process.env.WARP10_ENDPOINT.replace(/\/$/, ''),
    token: process.env.WARP10_READ_TOKEN,
    appId: process.env.CLEVER_APP_ID
  };
};

const parseHours = () => {
  const inline = process.argv.find((arg) => arg.startsWith('--hours='));
  const index = process.argv.indexOf('--hours');
  const raw = inline ? inline.slice('--hours='.length) : index === -1 ? '1' : process.argv[index + 1];
  const hours = Number(raw);
  if (!Number.isFinite(hours) || hours <= 0) {
    console.error('--hours expects a positive number');
    process.exit(1);
  }
  return hours;
};

// Never print the response body on error: Warp 10 echoes parts of the token.
const fetchSeries = async ({ endpoint, token, appId }, metric, nowMicros, timespanMicros) => {
  const url = new URL(`${endpoint}/fetch`);
  url.search = new URLSearchParams({
    selector: `${metric.selector}{app_id=${appId}}`,
    now: String(nowMicros),
    timespan: String(timespanMicros),
    format: 'json'
  }).toString();

  const response = await fetch(url, { headers: { 'X-Warp10-Token': token } });
  if (!response.ok) {
    const hint = response.status === 403 ? ' (token invalid or expired)' : '';
    throw new Error(`${metric.selector}: HTTP ${response.status}${hint}`);
  }

  const body = await response.text();
  let series = [];
  if (body.trim()) {
    try {
      series = JSON.parse(body).flat();
    } catch {
      // JSON.parse errors quote the start of the body.
      throw new Error(`${metric.selector}: response is not valid JSON`);
    }
  }
  return metric.cpuTotal ? series.filter((gts) => !gts.l.cpu || gts.l.cpu === 'cpu-total') : series;
};

const toPoints = (gts, metric) => {
  const map = metric.map ?? ((value) => value);
  const raw = gts.v.map((point) => [point[0], point[point.length - 1]]).sort((a, b) => a[0] - b[0]);
  if (!metric.counter) {
    return raw.map(([timestamp, value]) => [timestamp, map(value)]);
  }

  return (
    raw
      .slice(1)
      .map(([timestamp, value], index) => {
        const [previousTimestamp, previousValue] = raw[index];
        return [timestamp, map(((value - previousValue) * MICROS_PER_SECOND) / (timestamp - previousTimestamp))];
      })
      // Drops counter resets (negative) and duplicate timestamps (Infinity or NaN).
      .filter(([, rate]) => Number.isFinite(rate) && rate >= 0)
  );
};

const describeLabels = (labels) =>
  [
    labels.host && `host=${labels.host.slice(0, 8)}`,
    labels.flavor_name && `flavor=${labels.flavor_name}`,
    labels.interface && `interface=${labels.interface}`
  ]
    .filter(Boolean)
    .join(' ');

const summarize = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const pick = (ratio) => sorted[Math.min(sorted.length - 1, Math.floor(ratio * sorted.length))];
  const avg = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
  return { n: sorted.length, min: sorted[0], avg, p95: pick(0.95), max: sorted[sorted.length - 1] };
};

const formatNumber = (value) => value.toFixed(1).padStart(9);
const formatTime = (timestamp) => new Date(timestamp / 1000).toISOString();

const main = async () => {
  const env = loadEnv();
  const hours = parseHours();
  const nowMicros = Date.now() * 1000;
  const timespanMicros = hours * 3600 * MICROS_PER_SECOND;

  console.log(`Window: ${formatTime(nowMicros - timespanMicros)} -> ${formatTime(nowMicros)} (${hours}h)\n`);

  const results = await Promise.all(
    METRICS.map(async (metric) => ({ metric, series: await fetchSeries(env, metric, nowMicros, timespanMicros) }))
  );

  const deployments = new Map();

  for (const { metric, series } of results) {
    console.log(`${metric.label}  (${metric.selector})`);
    if (series.length === 0) {
      console.log('  no data\n');
      continue;
    }

    const peaks = [];
    for (const gts of series) {
      const points = toPoints(gts, metric);
      if (points.length === 0) {
        continue;
      }

      const labels = describeLabels(gts.l);
      const stats = summarize(points.map(([, value]) => value));
      console.log(
        `  n=${String(stats.n).padStart(5)} min${formatNumber(stats.min)} avg${formatNumber(stats.avg)}` +
          ` p95${formatNumber(stats.p95)} max${formatNumber(stats.max)}  ${labels}`
      );

      if (metric.peaks) {
        peaks.push(...points.map(([timestamp, value]) => ({ timestamp, value, labels })));
      }

      const deploymentId = gts.l.deployment_id;
      if (deploymentId) {
        const [first, last] = [points[0][0], points[points.length - 1][0]];
        const seen = deployments.get(deploymentId) ?? { first, last };
        deployments.set(deploymentId, { first: Math.min(seen.first, first), last: Math.max(seen.last, last) });
      }
    }

    peaks
      .sort((a, b) => b.value - a.value)
      .slice(0, PEAK_COUNT)
      .forEach(({ timestamp, value, labels }) =>
        console.log(`    peak ${formatTime(timestamp)} ${formatNumber(value)}  ${labels}`)
      );
    console.log('');
  }

  if (deployments.size > 0) {
    console.log('Deployments seen (more than one means a restart, redeploy or rescale in the window)');
    [...deployments.entries()]
      .sort(([, a], [, b]) => a.first - b.first)
      .forEach(([id, { first, last }]) => console.log(`  ${id}  ${formatTime(first)} -> ${formatTime(last)}`));
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
