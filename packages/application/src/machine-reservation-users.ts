import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';

export const listMachineReservationUsers = (
  reservation: MachineReservationViewModel
): UserSummaryViewModel[] => {
  const users = [reservation.creator, ...reservation.participants.map((participant) => participant.user)];
  return Array.from(new Map(users.map((user) => [user.id, user])).values());
};

export const excludeUserFromList = (
  users: UserSummaryViewModel[] | undefined,
  userId?: string
): UserSummaryViewModel[] => {
  if (!users) return [];
  if (!userId) return users;
  return users.filter((user) => user.id !== userId);
};
