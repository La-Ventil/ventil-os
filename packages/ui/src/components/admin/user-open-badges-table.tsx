import Image from 'next/image';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { OpenBadge } from '@repo/domain/badge/open-badge';
import { formatOpenBadgeLevelLabel } from '@repo/domain/badge/open-badge-level';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import ListEmptyState from '../list-empty-state';
import AdminTable from './admin-table';
import RowQuickActionsMenu from './row-quick-actions-menu';
import styles from './user-open-badges-table.module.css';

type UserOpenBadgesTableProps = {
  badges: OpenBadgeViewModel[];
  isPending?: boolean;
  labels: {
    actions: {
      manage: string;
      upgrade: string;
      downgrade: string;
      remove: string;
    };
    columns: {
      actions: string;
      image: string;
      badge: string;
      level: string;
    };
    empty: {
      title: string;
      description: string;
    };
  };
  onUpgrade: (badge: OpenBadgeViewModel, nextLevel: number) => void;
  onDowngrade: (badge: OpenBadgeViewModel, previousLevel: number) => void;
  onRemove: (badge: OpenBadgeViewModel) => void;
};

export default function UserOpenBadgesTable({
  badges,
  isPending = false,
  labels,
  onUpgrade,
  onDowngrade,
  onRemove
}: UserOpenBadgesTableProps) {
  if (!badges.length) {
    return <ListEmptyState title={labels.empty.title} description={labels.empty.description} />;
  }

  return (
    <AdminTable>
      <TableHead>
        <TableRow>
          <TableCell>{labels.columns.actions}</TableCell>
          <TableCell>{labels.columns.image}</TableCell>
          <TableCell>{labels.columns.badge}</TableCell>
          <TableCell>{labels.columns.level}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {badges.map((badge) => {
          const nextLevel = badge.levels.find((level) => level.level === badge.activeLevel + 1);
          const previousLevel = badge.levels.find((level) => level.level === badge.activeLevel - 1);
          const activeLevel = OpenBadge.getActiveLevel(badge);

          return (
            <TableRow key={badge.id} hover>
              <TableCell>
                <RowQuickActionsMenu
                  label={labels.actions.manage}
                  disabled={isPending}
                  items={[
                    {
                      label: labels.actions.upgrade,
                      disabled: !nextLevel,
                      onClick: nextLevel ? () => onUpgrade(badge, nextLevel.level) : undefined
                    },
                    {
                      label: labels.actions.downgrade,
                      disabled: !previousLevel,
                      onClick: previousLevel ? () => onDowngrade(badge, previousLevel.level) : undefined
                    },
                    { label: labels.actions.remove, onClick: () => onRemove(badge) }
                  ]}
                />
              </TableCell>
              <TableCell>
                {badge.coverImage ? (
                  <Image src={badge.coverImage} alt={badge.name} width={48} height={48} className={styles.coverImage} />
                ) : (
                  <span className={styles.coverPlaceholder}>OB</span>
                )}
              </TableCell>
              <TableCell>{badge.name}</TableCell>
              <TableCell>{activeLevel ? formatOpenBadgeLevelLabel(activeLevel) : '—'}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </AdminTable>
  );
}
