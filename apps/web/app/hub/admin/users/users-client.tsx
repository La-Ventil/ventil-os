"use client";

import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import AssignOpenBadgeDialog from './assign-open-badge-dialog';
import styles from './users.module.css';

type AdminUsersClientProps = {
  users: UserAdminViewModel[];
  openBadges: OpenBadgeViewModel[];
  labels: {
    title: string;
    subtitle: string;
    intro: string;
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
      assign: string;
    };
    adminStatus: {
      none: string;
      global: string;
      pedagogical: string;
    };
    assignModal: {
      title: string;
      subtitle: string;
      badgeLabel: string;
      levelLabel: string;
      userLabel: string;
      cancel: string;
      confirm: string;
      illustrationPlaceholder: string;
    };
  };
};

export default function AdminUsersClient({
  users,
  openBadges,
  labels
}: AdminUsersClientProps) {
  const [selectedUser, setSelectedUser] = useState<UserAdminViewModel | null>(null);

  const adminLabelFor = (user: UserAdminViewModel) => {
    if (user.globalAdmin) {
      return labels.adminStatus.global;
    }
    if (user.pedagogicalAdmin) {
      return labels.adminStatus.pedagogical;
    }
    return labels.adminStatus.none;
  };

  const userOptions = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        label: `${user.firstName} ${user.lastName ?? ''}`.trim()
      })),
    [users]
  );

  return (
    <>
      <SectionTitle>{labels.title}</SectionTitle>
      <Section>
        <SectionSubtitle>{labels.subtitle}</SectionSubtitle>
        <Typography variant="body1">{labels.intro}</Typography>
      </Section>

      <Section className={styles.tableSection}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>{labels.columns.firstName}</TableCell>
              <TableCell>{labels.columns.lastName}</TableCell>
              <TableCell>{labels.columns.username}</TableCell>
              <TableCell>{labels.columns.email}</TableCell>
              <TableCell>{labels.columns.profile}</TableCell>
              <TableCell>{labels.columns.admin}</TableCell>
              <TableCell>{labels.columns.machines}</TableCell>
              <TableCell>{labels.columns.events}</TableCell>
              <TableCell>{labels.columns.openBadges}</TableCell>
              <TableCell align="right">{labels.columns.assign}</TableCell>
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
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedUser(user)}
                  >
                    {labels.columns.assign}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <AssignOpenBadgeDialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        users={userOptions}
        openBadges={openBadges}
        labels={labels.assignModal}
      />
    </>
  );
}
