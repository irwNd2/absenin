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
  };
  is_checked?: boolean;
}
