export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'teacher' | 'admin';
  subjects?: string[];
  organization?: {
    id: string;
    name: string;
  };
  token: string;
} 