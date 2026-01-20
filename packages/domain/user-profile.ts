export interface UserProfile {
  id: string;
  profile: string;
  email: string;
  username: string;
  educationLevel?: string | null;
  lastName?: string;
  firstName: string;
  isAdminGlobal: boolean;
  isAdminPedagogical: boolean;
}
