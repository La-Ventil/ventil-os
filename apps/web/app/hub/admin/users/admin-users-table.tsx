import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';
import AdminTable from '@repo/ui/admin/admin-table';
import UserAvatar from '@repo/ui/user-avatar';
import UserQuickActions from './user-quick-actions';

type AdminUsersTableProps = {
  users: UserAdminViewModel[];
  columns: {
    actions: string;
    avatar: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    profile: string;
    admin: string;
    status: string;
    machines: string;
    events: string;
    openBadges: string;
  };
  adminLabelFor: (user: UserAdminViewModel) => string;
  statusLabelFor: (user: UserAdminViewModel) => string;
  actionLabels: {
    manage: string;
    edit: string;
    block: string;
    unblock: string;
  };
};

export default function AdminUsersTable({
  users,
  columns,
  adminLabelFor,
  statusLabelFor,
  actionLabels
}: AdminUsersTableProps) {
  return (
    <AdminTable>
      <TableHead>
        <TableRow>
          <TableCell>{columns.actions}</TableCell>
          <TableCell>{columns.avatar}</TableCell>
          <TableCell>{columns.firstName}</TableCell>
          <TableCell>{columns.lastName}</TableCell>
          <TableCell>{columns.username}</TableCell>
          <TableCell>{columns.email}</TableCell>
          <TableCell>{columns.profile}</TableCell>
          <TableCell>{columns.admin}</TableCell>
          <TableCell>{columns.status}</TableCell>
          <TableCell>{columns.machines}</TableCell>
          <TableCell>{columns.events}</TableCell>
          <TableCell>{columns.openBadges}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} hover>
            <TableCell>
              <UserQuickActions user={user} labels={actionLabels} />
            </TableCell>
            <TableCell>
              <UserAvatar user={{ image: user.image, email: user.email }} size={32} />
            </TableCell>
            <TableCell>{user.firstName}</TableCell>
            <TableCell>{user.lastName}</TableCell>
            <TableCell title={user.username}>
              {user.username.includes('#') ? user.username.split('#')[0] : user.username}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.profile}</TableCell>
            <TableCell>{adminLabelFor(user)}</TableCell>
            <TableCell>{statusLabelFor(user)}</TableCell>
            <TableCell>{user.stats.machinesCount}</TableCell>
            <TableCell>{user.stats.eventsCount}</TableCell>
            <TableCell>{user.stats.openBadgesCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </AdminTable>
  );
}
