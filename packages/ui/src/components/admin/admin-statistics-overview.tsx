import { getThemeSectionClassName } from '../../theme';
import { themeSectionIcons, type AdminThemeSection } from '../../admin/theme-section-icons';
import AdminMetricCard, { type AdminMetricCardMetric } from './admin-metric-card';
import styles from './admin-statistics-overview.module.css';

type AdminStatisticsOverviewMetric = AdminMetricCardMetric;

export type AdminStatisticsOverviewGroup = {
  id: AdminThemeSection;
  title: string;
  metrics: AdminStatisticsOverviewMetric[];
};

type AdminStatisticsOverviewProps = {
  groups: AdminStatisticsOverviewGroup[];
};

export default function AdminStatisticsOverview({ groups }: AdminStatisticsOverviewProps) {
  return (
    <section className={styles.root} aria-label="Global statistics">
      {groups.map((group) => {
        const themeClassName = getThemeSectionClassName(group.id);

        return (
          <AdminMetricCard
            key={group.id}
            className={themeClassName}
            title={group.title}
            icon={themeSectionIcons[group.id]}
            metrics={group.metrics}
          />
        );
      })}
    </section>
  );
}
