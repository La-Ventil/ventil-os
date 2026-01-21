export type EventRegistrationViewModel = {
  current: number;
  capacity: number;
};

export type EventViewModel = {
  id: string;
  type: string;
  name: string;
  startDate: string;
  location: string;
  audience: string;
  registration: EventRegistrationViewModel;
  description: string;
};
