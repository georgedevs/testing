export interface IUser {
  _id: string;
  email: string;
  role: "client" | "admin" | "counselor";
  isVerified: boolean;
  isActive: boolean;
  avatar?: {
    avatarId: string;
    imageUrl: string;
  };
  lastActive: Date;
  fullName?: string;
  username?: string;
  preferredCounselorGender?: "male" | "female" | "no_preference";
  preferredLanguages?: string[];
  timezone?: string;
  marriageYears?: number;
  age?: number;
  currentCounselor?: ICounselor;
  tourViewed?: boolean;
}

export interface ICounselorProfile {
  gender: "male" | "female";
  languages: string[];
  maxDailyMeetings: number;
  isAvailable: boolean;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  meetingPreferences: {
    maxConsecutiveMeetings: number;
  };
}

// Combined interface for users who are counselors
export interface ICounselorUser extends IUser, ICounselorProfile {}

export interface ICounselor {
  _id: string;
  fullName: string;
  email: string;
  avatar?: {
    imageUrl: string;
  };
}

export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activationToken:string | null;
}