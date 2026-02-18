export type ParticipantRef = { id: string };

export const resolveReservationParticipants = <T extends ParticipantRef>(creator: T, participants: T[]): T[] => {
  const unique = new Map<string, T>();
  unique.set(creator.id, creator);
  participants.forEach((participant) => {
    unique.set(participant.id, participant);
  });
  return Array.from(unique.values());
};

export const uniqueParticipantIds = (
  participantIds: string[] | undefined,
  creatorId: string
): string[] => {
  const unique = new Set<string>();
  (participantIds ?? []).forEach((participantId) => {
    if (participantId !== creatorId) {
      unique.add(participantId);
    }
  });
  return Array.from(unique);
};
