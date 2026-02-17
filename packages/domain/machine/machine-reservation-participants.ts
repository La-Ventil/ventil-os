export type ParticipantRef = { id: string };

export const resolveReservationParticipants = <T extends ParticipantRef>(creator: T, participants: T[]): T[] => {
  const unique = new Map<string, T>();
  unique.set(creator.id, creator);
  participants.forEach((participant) => {
    unique.set(participant.id, participant);
  });
  return Array.from(unique.values());
};
