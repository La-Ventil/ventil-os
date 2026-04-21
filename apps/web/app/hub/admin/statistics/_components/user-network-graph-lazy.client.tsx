'use client';

import { useEffect, useState } from 'react';
import type { UserNetworkGraphLabels, UserNetworkGraphProps } from '@repo/ui/admin/user-network-graph';
import UserNetworkGraph from '@repo/ui/admin/user-network-graph';
import type {
  AdminStatisticsNetworkEdgeViewModel,
  AdminStatisticsNetworkNodeViewModel
} from '@repo/application/admin/models/admin-statistics';

type NetworkPayload = {
  nodes: AdminStatisticsNetworkNodeViewModel[];
  edges: AdminStatisticsNetworkEdgeViewModel[];
  // Pre-formatted by the API route — no client-side i18n needed.
  generatedAt: string;
};

type UserNetworkGraphLazyProps = {
  labelsWithoutDate: Omit<UserNetworkGraphLabels, 'generatedAt'>;
};

export default function UserNetworkGraphLazy({ labelsWithoutDate }: UserNetworkGraphLazyProps) {
  const [data, setData] = useState<NetworkPayload | null>(null);

  useEffect(() => {
    let active = true;
    void fetch('/api/admin/statistics/network', { credentials: 'same-origin', cache: 'no-store' }).then(
      async (response) => {
        if (!response.ok || !active) return;
        setData((await response.json()) as NetworkPayload);
      }
    );
    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return null;
  }

  const labels: UserNetworkGraphProps['labels'] = { ...labelsWithoutDate, generatedAt: data.generatedAt };

  return <UserNetworkGraph nodes={data.nodes} edges={data.edges} labels={labels} />;
}
