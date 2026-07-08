export type UserRole =
  | "GUEST"
  | "MEMBER"
  | "MODERATOR"
  | "ADMINISTRATOR"
  | "SUPER_ADMINISTRATOR";

export interface UserProfile {
  id: string;
  userId: string;
  username: string | null;
  university: string | null;
  country: string | null;
  codeforcesHandle: string | null;
  atcoderHandle: string | null;
  leetcodeUsername: string | null;
  githubUsername: string | null;
  preferredTheme: "light" | "dark" | "system";
  preferredLanguage: "cpp" | "java" | "python" | "rust";
  bio: string | null;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  profile: UserProfile | null;
}

export interface Session {
  user: User;
  expires: string;
}
