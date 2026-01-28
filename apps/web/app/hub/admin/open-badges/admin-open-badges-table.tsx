import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { OpenBadgeAdminViewModel } from '@repo/view-models/open-badge-admin';
import AdminTable from '@repo/ui/admin/admin-table';

type AdminOpenBadgesTableProps = {
  badges: OpenBadgeAdminViewModel[];
  columns: {
    name: string;
    levels: string;
    assigned: string;
    status: string;
  };
  statusLabelFor: (badge: OpenBadgeAdminViewModel) => string;
};

export default function AdminOpenBadgesTable({
  badges,
  columns,
  statusLabelFor
}: AdminOpenBadgesTableProps) {
  return (
    <AdminTable>
      <TableHead>
        <TableRow>
          <TableCell>{columns.name}</TableCell>
          <TableCell>{columns.levels}</TableCell>
          <TableCell>{columns.assigned}</TableCell>
          <TableCell>{columns.status}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {badges.map((badge) => (
          <TableRow key={badge.id} hover>
            <TableCell>{badge.name}</TableCell>
            <TableCell>{badge.levelsCount}</TableCell>
            <TableCell>{badge.assignedCount}</TableCell>
            <TableCell>{statusLabelFor(badge)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </AdminTable>
  );
}
