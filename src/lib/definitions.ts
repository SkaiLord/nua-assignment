import { SessionOptions } from 'iron-session';

// Books related exports
export type Books = {
  title: string;
  first_publish_year: number;
  subject: string;
  author_name: string;
  author_birth_date: string;
  author_top_work: string;
  ratings_average: number;
};

export type TableContextType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  records: number;
  setRecords: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

// Auth Related exports
export interface SessionData {
  userId?: string;
  email?: string;
  img?: string;
  isPro?: boolean;
  isBlocked?: boolean;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_KEY!,
  cookieName: 'nua-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
};
