import { create } from "zustand";
import { User, Session, UserProfile } from "../types";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, name: string) => Promise<boolean>;
  register: (email: string, username: string, name: string) => Promise<boolean>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => void;
}

const defaultProfile: UserProfile = {
  id: "prof_1",
  userId: "usr_1",
  username: "masudul2002",
  university: "Sunamganj Science and Technology University",
  country: "Bangladesh",
  codeforcesHandle: "masudul2002",
  atcoderHandle: null,
  leetcodeUsername: null,
  githubUsername: "masudul2002",
  preferredTheme: "system",
  preferredLanguage: "cpp",
  bio: "Competitive Programmer & Treasurer at SSTU Computer Club.",
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,

  login: async (email, name) => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 800));
      
      const mockUser: User = {
        id: "usr_1",
        name: name || "MD. Masudul Hasan",
        email: email,
        image: null,
        role: "MEMBER",
        profile: { ...defaultProfile },
      };

      const mockSession: Session = {
        user: mockUser,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("cpkit_session", JSON.stringify(mockSession));
      }

      set({ user: mockUser, session: mockSession, loading: false });
      return true;
    } catch {
      set({ loading: false });
      return false;
    }
  },

  register: async (email, username, name) => {
    set({ loading: true });
    try {
      await new Promise((r) => setTimeout(r, 800));

      const mockUser: User = {
        id: "usr_1",
        name: name || "MD. Masudul Hasan",
        email: email,
        image: null,
        role: "MEMBER",
        profile: {
          ...defaultProfile,
          username: username,
        },
      };

      const mockSession: Session = {
        user: mockUser,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("cpkit_session", JSON.stringify(mockSession));
      }

      set({ user: mockUser, session: mockSession, loading: false });
      return true;
    } catch {
      set({ loading: false });
      return false;
    }
  },

  updateProfile: async (updatedFields) => {
    set((state) => {
      if (!state.user || !state.user.profile) return {};
      
      const newProfile = {
        ...state.user.profile,
        ...updatedFields,
      };

      const newUser: User = {
        ...state.user,
        profile: newProfile,
      };

      const newSession: Session = {
        user: newUser,
        expires: state.session?.expires || new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("cpkit_session", JSON.stringify(newSession));
      }

      return { user: newUser, session: newSession };
    });
    return true;
  },

  logout: async () => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 300));
    if (typeof window !== "undefined") {
      localStorage.removeItem("cpkit_session");
    }
    set({ user: null, session: null, loading: false });
  },

  checkSession: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cpkit_session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Session;
          // Verify expiration
          if (new Date(parsed.expires) > new Date()) {
            set({ user: parsed.user, session: parsed });
          } else {
            localStorage.removeItem("cpkit_session");
          }
        } catch {
          localStorage.removeItem("cpkit_session");
        }
      }
    }
  },
}));
