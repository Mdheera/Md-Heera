
import React, { useState } from 'react';
import { db } from '../store';
import { Student, Subject, Test } from '../types';
import { Plus, Users, BookOpen, GraduationCap, ClipboardList } from 'lucide-react';

const AdminSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'SUBJECTS' | 'TESTS'>('STUDENTS');
  const [studentForm, setStudentForm] = useState({ name: '', roll: '', classId: 'c10' });
  const [testForm, setTestForm] = useState({ name: '', classId: 'c10', max: '100' });

  const classes = db.getClasses();
  const students = db.getStudents();
  const subjects = db.getSubjects();
  const tests = db.getTests();

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: 'st_' + Date.now(),
      name: studentForm.name,
      rollNumber: studentForm.roll,
      classId: studentForm.classId,
      schoolId: 'sch_01'
    };
    db.addStudent(newStudent);
    setStudentForm({ ...studentForm, name: '', roll: '' });
  };

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: Test = {
      id: 't_' + Date.now(),
      name: testForm.name,
      classId: testForm.classId,
      maxMarks: parseInt(testForm.max),
      date: new Date().toISOString().split('T')[0]
    };
    db.addTest(newTest);
    setTestForm({ ...testForm, name: '', max: '100' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">स्कूल सेटअप (School Setup)</h2>
        <p className="text-slate-500">डेटा मैनेज करें</p>
      </div>

      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
        <button 
          onClick={() => setActiveTab('STUDENTS')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'STUDENTS' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Users size={18} /> विद्यार्थी
        </button>
        <button 
          onClick={() => setActiveTab('SUBJECTS')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'SUBJECTS' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <BookOpen size={18} /> विषय
        </button>
        <button 
          onClick={() => setActiveTab('TESTS')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'TESTS' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <ClipboardList size={18} /> टेस्ट
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Plus size={18} className="text-indigo-600" />
            {activeTab === 'STUDENTS' ? 'नया विद्यार्थी' : activeTab === 'SUBJECTS' ? 'नया विषय' : 'नया टेस्ट'}
          </h3>
          
          {activeTab === 'STUDENTS' && (
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input 
                type="text" placeholder="नाम (Name)" required 
                value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})}
                className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500" 
              />
              <input 
                type="text" placeholder="रोल नंबर (Roll No)" required
                value={studentForm.roll} onChange={e => setStudentForm({...studentForm, roll: e.target.value})}
                className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500" 
              />
              <select 
                value={studentForm.classId} onChange={e => setStudentForm({...studentForm, classId: e.target.value})}
                className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none"
              >
                {classes.map(c => <option key={c.id} value={c.id}>Class {c.name}</option>)}
              </select>
              <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">जोड़ें (Add)</button>
            </form>
          )}

          {activeTab === 'TESTS' && (
            <form onSubmit={handleAddTest} className="space-y-4">
              <input 
                type="text" placeholder="टेस्ट का नाम (Test Name)" required 
                value={testForm.name} onChange={e => setTestForm({...testForm, name: e.target.value})}
                className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500" 
              />
              <input 
                type="number" placeholder="पूर्णांक (Max Marks)" required
                value={testForm.max} onChange={e => setTestForm({...testForm, max: e.target.value})}
                className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500" 
              />
              <select 
                value={testForm.classId} onChange={e => setTestForm({...testForm, classId: e.target.value})}
                className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none"
              >
                {classes.map(c => <option key={c.id} value={c.id}>Class {c.name}</option>)}
              </select>
              <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">टेस्ट बनाएं (Create)</button>
            </form>
          )}

          {activeTab === 'SUBJECTS' && (
            <div className="p-4 text-center text-slate-400 text-sm">विषय सेटअप अभी एडमिन के लिए लॉक है (Coming soon)</div>
          )}
        </div>

        {/* List Column */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold">लिस्ट (Current Records)</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-auto">
            {activeTab === 'STUDENTS' && students.map(s => (
              <div key={s.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-400">Class {classes.find(c => c.id === s.classId)?.name} | Roll: {s.rollNumber}</p>
                </div>
              </div>
            ))}
            {activeTab === 'TESTS' && tests.map(t => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">Class {classes.find(c => c.id === t.classId)?.name} | पूर्णांक: {t.maxMarks}</p>
                </div>
              </div>
            ))}
            {activeTab === 'SUBJECTS' && subjects.map(s => (
              <div key={s.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-400">Class {classes.find(c => c.id === s.classId)?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
