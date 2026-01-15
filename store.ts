
import { 
  User, School, ClassRoom, 
  Subject, Student, Test, Mark, UserRole, AttendanceRecord, StudentFeedback 
} from './types';

const STORAGE_KEYS = {
  USER: 'rs_user_v4',
  SCHOOLS: 'rs_schools',
  CLASSES: 'rs_classes',
  SUBJECTS: 'rs_subjects',
  STUDENTS: 'rs_students',
  TESTS: 'rs_tests',
  MARKS: 'rs_marks',
  ATTENDANCE: 'rs_attendance',
  FEEDBACK: 'rs_feedback'
};

const get = <T,>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const set = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const seed = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SCHOOLS)) {
    const schoolId = 'sch_01';
    set(STORAGE_KEYS.SCHOOLS, [{ id: schoolId, name: 'Magadh International School', address: 'Patna, Bihar' }]);
    
    const classList: ClassRoom[] = [
      { id: 'c9', name: '9' }, { id: 'c10', name: '10' }, { id: 'c11', name: '11' }, { id: 'c12', name: '12' }
    ];
    set(STORAGE_KEYS.CLASSES, classList);

    const subjects: Subject[] = [];
    const core = ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'];
    const senior = ['Physics', 'Chemistry', 'Biology', 'Maths', 'English Core', 'Computer Science'];
    
    // Seed subjects for all classes
    classList.forEach(c => {
        const list = (c.name === '11' || c.name === '12') ? senior : core;
        list.forEach((sName, idx) => {
            subjects.push({ id: `sub_${c.id}_${idx}`, name: sName, classId: c.id });
        });
    });
    set(STORAGE_KEYS.SUBJECTS, subjects);

    // Generate 60 students for EVERY class (Total 240)
    const students: Student[] = [];
    const firstNames = ['Aman', 'Anjali', 'Vikash', 'Sneha', 'Rahul', 'Priya', 'Rohan', 'Kavita', 'Suresh', 'Meera', 'Aditya', 'Ishani', 'Karan', 'Zoya', 'Sumit', 'Neha'];
    const lastNames = ['Kumar', 'Singh', 'Jha', 'Mishra', 'Prasad', 'Yadav', 'Sinha', 'Gupta'];

    classList.forEach(c => {
        for (let i = 1; i <= 60; i++) {
            students.push({
                id: `st_${c.id}_${i}`,
                name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
                rollNumber: i.toString(),
                classId: c.id,
                schoolId,
                parentPhone: (c.id === 'c10' && i === 1) ? '8888888888' : undefined
            });
        }
    });
    set(STORAGE_KEYS.STUDENTS, students);

    // Tests for all classes
    const tests: Test[] = [];
    classList.forEach(c => {
        tests.push({ id: `t_${c.id}_mid`, name: 'Mid-Term', classId: c.id, maxMarks: 100, date: '2024-04-10' });
        tests.push({ id: `t_${c.id}_unit`, name: 'Unit Test I', classId: c.id, maxMarks: 50, date: '2024-05-15' });
    });
    set(STORAGE_KEYS.TESTS, tests);

    // Initial random performance for some students
    const initialMarks: Mark[] = [];
    ['st_c9_1', 'st_c10_1', 'st_c11_1', 'st_c12_1'].forEach(sid => {
        const student = students.find(s => s.id === sid);
        const sSubs = subjects.filter(s => s.classId === student?.classId);
        sSubs.forEach(sub => {
            initialMarks.push({ 
                id: `m_${sid}_${sub.id}`, 
                studentId: sid, 
                testId: `t_${student?.classId}_mid`, 
                subjectId: sub.id, 
                obtainedMarks: 65 + Math.floor(Math.random() * 30), 
                timestamp: Date.now() 
            });
        });
    });
    set(STORAGE_KEYS.MARKS, initialMarks);

    // Attendance and Feedback
    set(STORAGE_KEYS.ATTENDANCE, []);
    set(STORAGE_KEYS.FEEDBACK, [
        { 
            id: 'fb1', 
            studentId: 'st_c10_1', 
            teacherId: 'u_1', 
            month: 'April 2024', 
            comment: 'Very good student, but needs to focus on Geometry.',
            aiEnhancedComment: 'Aman is showing strong potential. While his overall progress is commendable, providing him with more practice in visual Mathematics like Geometry will boost his confidence.',
            timestamp: Date.now() 
        }
    ]);
  }
};

seed();

export const db = {
  getCurrentUser: (): User | null => get(STORAGE_KEYS.USER, null),
  setCurrentUser: (user: User | null) => set(STORAGE_KEYS.USER, user),
  getClasses: (): ClassRoom[] => get(STORAGE_KEYS.CLASSES, []),
  getSubjects: (classId?: string): Subject[] => {
    const subs = get<Subject[]>(STORAGE_KEYS.SUBJECTS, []);
    return classId ? subs.filter(s => s.classId === classId) : subs;
  },
  getStudents: (classId?: string): Student[] => {
    const stds = get<Student[]>(STORAGE_KEYS.STUDENTS, []);
    return classId ? stds.filter(s => s.classId === classId) : stds;
  },
  // Fix: Added missing addStudent method
  addStudent: (student: Student) => set(STORAGE_KEYS.STUDENTS, [...get<Student[]>(STORAGE_KEYS.STUDENTS, []), student]),
  getTests: (classId?: string): Test[] => {
    const tests = get<Test[]>(STORAGE_KEYS.TESTS, []);
    return classId ? tests.filter(t => t.classId === classId) : tests;
  },
  // Fix: Added missing addTest method
  addTest: (test: Test) => set(STORAGE_KEYS.TESTS, [...get<Test[]>(STORAGE_KEYS.TESTS, []), test]),
  getMarks: (testId?: string): Mark[] => get<Mark[]>(STORAGE_KEYS.MARKS, []),
  saveMarks: (newMarks: Mark[]) => {
    const existing = get<Mark[]>(STORAGE_KEYS.MARKS, []);
    set(STORAGE_KEYS.MARKS, [...existing, ...newMarks]);
  },
  getAttendance: (studentId?: string): AttendanceRecord[] => {
    const records = get<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
    return studentId ? records.filter(r => r.studentId === studentId) : records;
  },
  saveAttendance: (records: AttendanceRecord[]) => set(STORAGE_KEYS.ATTENDANCE, [...get<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []), ...records]),
  getFeedback: (studentId?: string): StudentFeedback[] => {
    const fb = get<StudentFeedback[]>(STORAGE_KEYS.FEEDBACK, []);
    return studentId ? fb.filter(f => f.studentId === studentId) : fb;
  },
  saveFeedback: (fb: StudentFeedback) => set(STORAGE_KEYS.FEEDBACK, [...get<StudentFeedback[]>(STORAGE_KEYS.FEEDBACK, []), fb])
};
