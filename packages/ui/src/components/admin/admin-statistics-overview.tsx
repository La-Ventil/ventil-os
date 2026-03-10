import type { ReactNode } from 'react';
import AdminMetricCard, { type AdminMetricCardMetric } from './admin-metric-card';
import styles from './admin-statistics-overview.module.css';

type AdminStatisticsOverviewMetric = AdminMetricCardMetric;

type AdminStatisticsOverviewGroup = {
  id: string;
  title: string;
  icon?: ReactNode;
  metrics: AdminStatisticsOverviewMetric[];
};

type AdminStatisticsOverviewProps = {
  groups: AdminStatisticsOverviewGroup[];
};

type GroupIconClassKey = 'iconUsers' | 'iconEvents' | 'iconOpenBadges' | 'iconMachines';
type GroupValueClassKey = 'valueUsers' | 'valueEvents' | 'valueOpenBadges' | 'valueMachines';

const iconClassKeyByGroupId: Record<string, GroupIconClassKey> = {
  users: 'iconUsers',
  events: 'iconEvents',
  'open-badges': 'iconOpenBadges',
  machines: 'iconMachines'
};

const valueClassKeyByGroupId: Record<string, GroupValueClassKey> = {
  users: 'valueUsers',
  events: 'valueEvents',
  'open-badges': 'valueOpenBadges',
  machines: 'valueMachines'
};

export default function AdminStatisticsOverview({ groups }: AdminStatisticsOverviewProps) {
  return (
    <section className={styles.root} aria-label="Global statistics">
      {groups.map((group) => {
        const iconClassKey = iconClassKeyByGroupId[group.id];
        const valueClassKey = valueClassKeyByGroupId[group.id];
        const iconClassName = iconClassKey ? (styles[iconClassKey] ?? '') : '';
        const metricValueClassName = valueClassKey ? (styles[valueClassKey] ?? '') : '';

        return (
          <AdminMetricCard
            key={group.id}
            title={group.title}
            icon={group.icon}
            iconClassName={iconClassName}
            metricValueClassName={metricValueClassName}
            metrics={group.metrics}
          />
        );
      })}
    </section>
  );
}
