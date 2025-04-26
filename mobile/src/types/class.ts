export interface Class {
  ID: string;
  Name: string;
  Students?: Student[];
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

export interface Student {
  ID: string;
  Name: string;
  status?: 'present' | 'sick' | 'absent';
} 