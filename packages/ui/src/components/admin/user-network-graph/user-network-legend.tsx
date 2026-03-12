import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import styles from './user-network-legend.module.css';

type UserNetworkGraphLegendItem = {
  id: string;
  title: string;
  description: string;
  swatch: ReactNode;
};

type UserNetworkGraphLegendProps = {
  items: UserNetworkGraphLegendItem[];
};

export default function UserNetworkGraphLegend({ items }: UserNetworkGraphLegendProps) {
  return (
    <aside className={styles.legend} aria-label="Legend">
      {items.map((item) => (
        <div key={item.id} className={styles.legendItem}>
          {item.swatch}
          <div className={styles.legendText}>
            <Typography component="p" variant="subtitle2" className={styles.legendTitle}>
              {item.title}
            </Typography>
            <Typography component="p" variant="body2" className={styles.legendDescription}>
              {item.description}
            </Typography>
          </div>
        </div>
      ))}
    </aside>
  );
}
