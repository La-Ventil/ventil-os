import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import styles from './stats-list.module.css';

export type StatsListEntry = {
  id: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  count: number;
};

export type StatsListProps = {
  stats: StatsListEntry[];
};

function StatsListItem({ icon, label, count }: Omit<StatsListEntry, 'id'>) {
  return (
    <ListItem className={styles.listItem}>
      <Typography variant="h3">{label}</Typography>
      <div className={styles.statGroup}>
        <div>{icon}</div>
        <Typography variant="body1" className={styles.statNumber}>
          {count.toLocaleString()}
        </Typography>
      </div>
    </ListItem>
  );
}

export default function StatsList({ stats }: StatsListProps) {
  return (
    <List className={styles.list}>
      {stats.map(({ id, icon, label, count }) => (
        <StatsListItem key={id} icon={icon} label={label} count={count} />
      ))}
    </List>
  );
}
