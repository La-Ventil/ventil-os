export type OpenBadgeEditViewModel = {
  id: string;
  name: string;
  description: string;
  coverImage?: string | null;
  levels: Array<{ title: string; description: string }>;
  activationEnabled: boolean;
};
