
import React, { useState, useEffect } from 'react';
import { db } from '../store';
import { Language, Student, Mark } from '../types';
import { CheckCircle, Save, ArrowLeft, ChevronRight, Search, ClipboardList } from 'lucide-react';
import { translations } from '../translations';

const MarksEntry: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];
  const [step, setStep] = useState<'SELECT' | 'ENTRY'>('SELECT');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [students, setStudents] = useState<Student[]>([]);
  const [marksData, setMarksData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const classes = db.getClasses();
  const subjects = db.getSubjects(selectedClass);
  const tests = db.getTests(selectedClass);

  useEffect(() => {
    if (step === 'ENTRY' && selectedClass) {
      setStudents(db.getStudents(selectedClass));
    }
  }, [step, selectedClass]);

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNumber.includes(searchQuery));

  const handleSave = () => {
    setSaving(true);
    const newMarks: Mark[] = Object.entries(marksData).map(([sid, val]) => ({
        id: `m_${sid}_${selectedTest}`,
        studentId: sid,
        testId: selectedTest,
        subjectId: selectedSubject,
        obtainedMarks: parseInt(val) || 0,
        timestamp: Date.now()
    }));
    setTimeout(() => {
        db.saveMarks(newMarks);
        setSaving(false);
        setSaved(true);
        setTimeout(() => { setSaved(false); setStep('SELECT'); }, 1500);
    }, 1000);
  };

  if (step === 'SELECT') {
    return (
      <div className="max-w-xl mx-auto py-10 animate-in zoom-in-95 duration-500">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-100">
            <ClipboardList size={28} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t.marks_entry}</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Select evaluation context</p>
        </div>

        <div className="space-y-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.select_class}</label>
            <div className="grid grid-cols-4 gap-2">
                {classes.map(c => (
                    <button 
                        key={c.id}
                        onClick={() => { setSelectedClass(c.id); setSelectedSubject(''); setSelectedTest(''); }}
                        className={`py-3 rounded-xl font-black text-xs transition-all border ${selectedClass === c.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-slate-50 text-slate-500 border-transparent hover:border-slate-100'}`}
                    >
                        {c.name}th
                    </button>
                ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.choose_subject}</label>
            <select 
              disabled={!selectedClass}
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 outline-none appearance-none font-bold text-slate-700 disabled:opacity-50"
            >
              <option value="">Choose Subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.choose_test}</label>
            <select 
              disabled={!selectedClass}
              value={selectedTest} 
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 outline-none appearance-none font-bold text-slate-700 disabled:opacity-50"
            >
              <option value="">Choose Examination</option>
              {tests.map(t => <option key={t.id} value={t.id}>{t.name} ({t.maxMarks} Marks)</option>)}
            </select>
          </div>

          <button
            onClick={() => setStep('ENTRY')}
            disabled={!selectedTest || !selectedSubject}
            className="w-full mt-2 py-4 bg-emerald-600 text-white rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50"
          >
            Enter Data List
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-32">
      <div className="flex items-center gap-5 mb-8">
        <button onClick={() => setStep('SELECT')} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 shadow-sm transition-all active:scale-95">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">{tests.find(t => t.id === selectedTest)?.name}</h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{subjects.find(s => s.id === selectedSubject)?.name} • Grade {selectedClass.replace('c','')}</p>
        </div>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
        <input 
            type="text" 
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:border-emerald-500 font-bold transition-all"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50/50 flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
          <span>Scholar Details</span>
          <span className="mr-6">Marks</span>
        </div>
        <div className="divide-y divide-slate-50 max-h-[50vh] overflow-auto custom-scrollbar">
          {filteredStudents.map((student) => (
            <div key={student.id} className="px-5 py-4 flex items-center justify-between group hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-black text-xs">
                  {student.rollNumber}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                  <p className="text-[8px] text-slate-400 font-black uppercase">Roll {student.rollNumber}</p>
                </div>
              </div>
              <input
                type="number"
                placeholder="--"
                value={marksData[student.id] || ''}
                onChange={(e) => setMarksData({...marksData, [student.id]: e.target.value})}
                className="w-16 p-2 text-center text-lg font-black bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-600 focus:bg-white outline-none transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-24 left-6 right-6 md:relative md:bottom-0 md:left-0 md:right-0 md:mt-8">
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
            saved ? 'bg-emerald-500 shadow-emerald-200' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {saving ? 'Saving...' : saved ? <><CheckCircle size={20} /> Saved</> : <><Save size={20} /> {t.submit}</>}
        </button>
      </div>
    </div>
  );
};

export default MarksEntry;
