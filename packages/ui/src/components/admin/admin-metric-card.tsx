import type { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import styles from './admin-metric-card.module.css';

export type AdminMetricCardTone = 'blue' | 'yellow' | 'red';

export type AdminMetricCardMetric = {
  label: string;
  value: number;
  tone?: AdminMetricCardTone;
};

export type AdminMetricCardProps = {
  className?: string;
  title: string;
  icon?: ReactNode;
  metrics: AdminMetricCardMetric[];
};

type MetricToneClassKey = 'valueBlue' | 'valueYellow' | 'valueRed';

const metricToneClassKeyByTone: Record<AdminMetricCardTone, MetricToneClassKey> = {
  blue: 'valueBlue',
  yellow: 'valueYellow',
  red: 'valueRed'
};

export default function AdminMetricCard({ className, title, icon, metrics }: AdminMetricCardProps) {
  return (
    <Card className={`${styles.card} ${className ?? ''}`} elevation={0} component="article">
      <CardHeader
        className={styles.header}
        avatar={
          icon ? (
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
          ) : undefined
        }
        title={
          <Typography component="h2" variant="overline" className={styles.title}>
            {title}
          </Typography>
        }
      />
      <CardContent className={`${styles.content} ${icon ? styles.contentWithIcon : ''}`}>
        <dl className={styles.metrics}>
          {metrics.map((metric) => (
            <div key={metric.label} className={styles.metric}>
              <Typography component="dt" variant="caption" className={styles.label}>
                {metric.label}
              </Typography>
              <Typography
                component="dd"
                variant="h5"
                className={`${styles.value} ${metric.tone ? (styles[metricToneClassKeyByTone[metric.tone]] ?? '') : ''}`}
              >
                {metric.value.toLocaleString()}
              </Typography>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
