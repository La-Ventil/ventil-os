import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Link from 'next/link';
import type { OpenBadgeAdminViewModel } from '@repo/view-models/open-badge-admin';
import AdminTable from '@repo/ui/admin/admin-table';
import OpenBadgeQuickActions from './open-badge-quick-actions';

type AdminOpenBadgesTableProps = {
  badges: OpenBadgeAdminViewModel[];
  columns: {
    image: string;
    name: string;
    levels: string;
    assigned: string;
    status: string;
    actions: string;
    assign: string;
  };
  statusLabelFor: (badge: OpenBadgeAdminViewModel) => string;
  actionLabels: {
    manage: string;
    edit: string;
    activate: string;
    deactivate: string;
    remove: string;
  };
};

export default function AdminOpenBadgesTable({
  badges,
  columns,
  statusLabelFor,
  actionLabels
}: AdminOpenBadgesTableProps) {
  return (
    <AdminTable>
      <TableHead>
        <TableRow>
          <TableCell>{columns.actions}</TableCell>
          <TableCell>{columns.image}</TableCell>
          <TableCell>{columns.name}</TableCell>
          <TableCell>{columns.levels}</TableCell>
          <TableCell>{columns.assigned}</TableCell>
          <TableCell>{columns.status}</TableCell>
          <TableCell align="right">{columns.assign}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {badges.map((badge) => (
          <TableRow key={badge.id} hover>
            <TableCell>
              <OpenBadgeQuickActions badge={badge} labels={actionLabels} />
            </TableCell>
            <TableCell>
              {badge.coverImage ? (
                <img
                  src={badge.coverImage}
                  alt={badge.name}
                  width={40}
                  height={40}
                  style={{ objectFit: 'contain', display: 'block' }}
                />
              ) : (
                '—'
              )}
            </TableCell>
            <TableCell>{badge.name}</TableCell>
            <TableCell>{badge.levelsCount}</TableCell>
            <TableCell>{badge.assignedCount}</TableCell>
            <TableCell>{statusLabelFor(badge)}</TableCell>
            <TableCell align="right">
              <Link href={`/hub/admin/open-badges/${badge.id}`}>
                <Button size="small" variant="contained" color="secondary" component="span">
                  {columns.assign}
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </AdminTable>
  );
}
