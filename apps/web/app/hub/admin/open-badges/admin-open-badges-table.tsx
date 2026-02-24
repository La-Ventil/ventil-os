import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import type { OpenBadgeAdminViewModel } from '@repo/view-models/open-badge-admin';
import { OpenBadgeAdminStatus } from '@repo/view-models/open-badge-admin';
import AdminTable from '@repo/ui/admin/admin-table';
import { setOpenBadgeStatusAction } from '../../../../lib/actions/set-open-badge-status';
import { removeOpenBadgeAction } from '../../../../lib/actions/remove-open-badge';

type AdminOpenBadgesTableProps = {
  badges: OpenBadgeAdminViewModel[];
  columns: {
    name: string;
    levels: string;
    assigned: string;
    status: string;
    actions: string;
    assign: string;
  };
  statusLabelFor: (badge: OpenBadgeAdminViewModel) => string;
  actionLabels: {
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
          <TableCell>{columns.name}</TableCell>
          <TableCell>{columns.levels}</TableCell>
          <TableCell>{columns.assigned}</TableCell>
          <TableCell>{columns.status}</TableCell>
          <TableCell align="right">{columns.actions}</TableCell>
          <TableCell align="right">{columns.assign}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {badges.map((badge) => (
          <TableRow key={badge.id} hover>
            <TableCell>{badge.name}</TableCell>
            <TableCell>{badge.levelsCount}</TableCell>
            <TableCell>{badge.assignedCount}</TableCell>
            <TableCell>{statusLabelFor(badge)}</TableCell>
            <TableCell align="right">
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <form action={setOpenBadgeStatusAction}>
                  <input type="hidden" name="badgeId" value={badge.id} />
                  <input
                    type="hidden"
                    name="nextStatus"
                    value={
                      badge.status === OpenBadgeAdminStatus.Active
                        ? OpenBadgeAdminStatus.Inactive
                        : OpenBadgeAdminStatus.Active
                    }
                  />
                  <Button size="small" variant="outlined" type="submit">
                    {badge.status === OpenBadgeAdminStatus.Active
                      ? actionLabels.deactivate
                      : actionLabels.activate}
                  </Button>
                </form>
                {badge.assignedCount === 0 ? (
                  <form action={removeOpenBadgeAction}>
                    <input type="hidden" name="badgeId" value={badge.id} />
                    <Button size="small" variant="outlined" color="error" type="submit">
                      {actionLabels.remove}
                    </Button>
                  </form>
                ) : null}
              </Stack>
            </TableCell>
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
