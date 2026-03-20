import { redirect } from 'next/navigation';

type LegacyMachinePageProps = {
  params: Promise<{ machineId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const toQueryString = (searchParams: Record<string, string | string[] | undefined> | undefined): string => {
  if (!searchParams) {
    return '';
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      params.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        params.append(key, entry);
      }
    }
  }

  const query = params.toString();
  return query ? `?${query}` : '';
};

export default async function LegacyMachinePage({ params, searchParams }: LegacyMachinePageProps) {
  const { machineId } = await params;
  redirect(`/hub/fab-lab/machines/${machineId}${toQueryString(await searchParams)}`);
}
