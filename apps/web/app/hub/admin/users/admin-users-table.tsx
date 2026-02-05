import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';
import AdminTable from '@repo/ui/admin/admin-table';

type AdminUsersTableProps = {
  users: UserAdminViewModel[];
  columns: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    profile: string;
    admin: string;
    machines: string;
    events: string;
    openBadges: string;
  };
  adminLabelFor: (user: UserAdminViewModel) => string;
};

export default function AdminUsersTable({ users, columns, adminLabelFor }: AdminUsersTableProps) {
  return (
    <AdminTable>
      <TableHead>
        <TableRow>
          <TableCell>{columns.firstName}</TableCell>
          <TableCell>{columns.lastName}</TableCell>
          <TableCell>{columns.username}</TableCell>
          <TableCell>{columns.email}</TableCell>
          <TableCell>{columns.profile}</TableCell>
          <TableCell>{columns.admin}</TableCell>
          <TableCell>{columns.machines}</TableCell>
          <TableCell>{columns.events}</TableCell>
          <TableCell>{columns.openBadges}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} hover>
            <TableCell>{user.firstName}</TableCell>
            <TableCell>{user.lastName ?? '-'}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.profile}</TableCell>
            <TableCell>{adminLabelFor(user)}</TableCell>
            <TableCell>{user.machinesCount}</TableCell>
            <TableCell>{user.eventsCount}</TableCell>
            <TableCell>{user.openBadgesCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </AdminTable>
  );
}
