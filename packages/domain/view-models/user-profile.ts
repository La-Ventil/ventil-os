export interface UserProfile {
  id: string;
  profile: string;
  email: string;
  username: string;
  educationLevel?: string | null;
  lastName?: string;
  firstName: string;
  globalAdmin: boolean;
  pedagogicalAdmin: boolean;
}
