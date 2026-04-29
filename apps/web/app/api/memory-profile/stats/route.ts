import { memoryUsage, getActiveResourcesInfo, pid, uptime } from 'node:process';
import { getHeapSpaceStatistics, getHeapStatistics } from 'node:v8';
import { assertMemoryProfileAccess } from '../../../../lib/memory-profile';

export async function GET(request: Request) {
  const denied = assertMemoryProfileAccess(request);
  if (denied) {
    return denied;
  }

  const memory = memoryUsage();
  const activeResources = getActiveResourcesInfo();
  const activeResourceCounts = activeResources.reduce<Record<string, number>>((counts, resource) => {
    counts[resource] = (counts[resource] ?? 0) + 1;
    return counts;
  }, {});

  return Response.json({
    capturedAt: new Date().toISOString(),
    pid,
    uptimeSeconds: uptime(),
    memory,
    heapStatistics: getHeapStatistics(),
    heapSpaces: getHeapSpaceStatistics(),
    activeResourceCounts
  });
}
