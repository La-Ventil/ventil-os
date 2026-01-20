export type EventRegistration = {
  current: number;
  capacity: number;
};

export type Event = {
  id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  location: string;
  audience: string;
  registration: EventRegistration;
  description: string;
};
