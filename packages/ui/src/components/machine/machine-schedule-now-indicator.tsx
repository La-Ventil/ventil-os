import type { CSSProperties } from 'react';

import styles from './machine-schedule-now-indicator.module.css';

type MachineScheduleNowIndicatorProps = {
  row: number;
  offsetPercent: string;
};

const MachineScheduleNowIndicator = ({ row, offsetPercent }: MachineScheduleNowIndicatorProps) => (
  <div
    className={styles.nowIndicator}
    style={
      {
        gridRow: row,
        '--now-offset': offsetPercent
      } as CSSProperties
    }
  >
    <span className={styles.nowDot} />
    <span className={styles.nowLine} />
  </div>
);

export default MachineScheduleNowIndicator;
