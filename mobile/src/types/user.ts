export type UserRole = 'teacher' | 'student' | 'parent';

export interface Organization {
  id: string;
  name: string;
  address: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber: string;
  avatar?: string;
  subjects?: string[];
  department?: string;
  employeeId?: string;
  organization?: Organization;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherUser extends User {
  role: 'teacher';
  employeeId: string;
  department: string;
  subjects: string[];
  organization: Organization;
} 