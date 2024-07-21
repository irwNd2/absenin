export interface Student {
  id: number;
  name: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  parent: {
    id: number;
    name: string;
    email: string;
    updatedAt: string;
    createdAt: string;
    expo_token: string | null;
  };
  is_checked?: boolean;
}
