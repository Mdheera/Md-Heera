
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT'
}

export type Language = 'en' | 'hi' | 'hinglish';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  schoolId: string;
  studentId?: string;
  language?: Language;
}

export interface School {
  id: string;
  name: string;
  address: string;
}

export interface ClassRoom {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  classId: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  classId: string;
  schoolId: string;
  parentPhone?: string;
}

export interface Test {
  id: string;
  name: string;
  classId: string;
  maxMarks: number;
  date: string;
}

export interface Mark {
  id: string;
  studentId: string;
  testId: string;
  subjectId: string;
  obtainedMarks: number;
  timestamp: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT';
}

export interface StudentFeedback {
  id: string;
  studentId: string;
  teacherId: string;
  month: string; // e.g. "May 2024"
  comment: string;
  aiEnhancedComment?: string;
  timestamp: number;
}
