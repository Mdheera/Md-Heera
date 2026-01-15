
import React, { useState } from 'react';
import { db } from '../store';
import { Language, AttendanceRecord } from '../types';
import { Calendar, Check, Search, UserCheck, CheckSquare, Save } from 'lucide-react';
import { translations } from '../translations';

const AttendanceEntry: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];
  const [selectedClass, setSelectedClass] = useState<string>('c10');
  const [attendance, setAttendance] = useState<Record<string, 'PRESENT' | 'ABSENT'>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const classes = db.getClasses();
  const students = db.getStudents(selectedClass);
  const today = new Date().toISOString().split('T')[0];
  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNumber.includes(searchQuery));

  const handleToggle = (sid: string, status: 'PRESENT' | 'ABSENT') => setAttendance({...attendance, [sid]: status});

  const saveAttendance = () => {
    setSaving(true);
    const records: AttendanceRecord[] = students.map(s => ({
      id: `a_${s.id}_${today}`,
      studentId: s.id,
      date: today,
      status: attendance[s.id] || 'PRESENT'
    }));
    setTimeout(() => {
        db.saveAttendance(records);
        setSaving(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t.attendance}</h2>
            <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-emerald-600" />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long' })}</p>
            </div>
        </div>
        <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm relative overflow-hidden group">
            <UserCheck size={28} />
            <div className="absolute bottom-0 w-full h-1 bg-emerald-500"></div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Active Grade</label>
        <div className="grid grid-cols-4 gap-3">
            {classes.map(c => (
                <button
                    key={c.id}
                    onClick={() => setSelectedClass(c.id)}
                    className={`py-4 rounded-2xl font-black text-xs transition-all border ${selectedClass === c.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-500 border-transparent hover:border-emerald-100'}`}
                >
                    {c.name}th
                </button>
            ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 relative w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                    type="text" 
                    placeholder={t.search} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-3xl shadow-sm outline-none focus:border-emerald-500 font-bold transition-all"
                />
            </div>
            <button 
                onClick={() => {
                    const all: Record<string, 'PRESENT' | 'ABSENT'> = {};
                    students.forEach(s => all[s.id] = 'PRESENT');
                    setAttendance(all);
                }}
                className="px-6 py-4 bg-emerald-50 text-emerald-600 rounded-[22px] hover:bg-emerald-100 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
            >
                <CheckSquare size={16} /> Mark All Present
            </button>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden">
            <div className="max-h-[50vh] overflow-auto divide-y divide-slate-50 custom-scrollbar">
                {filteredStudents.map(s => {
                    const status = attendance[s.id] || 'PRESENT';
                    return (
                        <div key={s.id} className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-all">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {s.rollNumber}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${status === 'PRESENT' ? 'text-emerald-500' : 'text-rose-500'}`}>{status}</p>
                                </div>
                            </div>
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                <button 
                                    onClick={() => handleToggle(s.id, 'PRESENT')}
                                    className={`w-12 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${status === 'PRESENT' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
                                >
                                    P
                                </button>
                                <button 
                                    onClick={() => handleToggle(s.id, 'ABSENT')}
                                    className={`w-12 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${status === 'ABSENT' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400'}`}
                                >
                                    A
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="fixed bottom-24 left-6 right-6 md:relative md:bottom-0 md:left-0 md:right-0">
            <button
                onClick={saveAttendance}
                disabled={saving || success}
                className={`w-full py-5 rounded-3xl font-black text-white shadow-2xl transition-all flex items-center justify-center gap-3 ${
                    success ? 'bg-emerald-500 shadow-emerald-200' : 'bg-emerald-600 hover:scale-[1.02] active:scale-95 shadow-emerald-200'
                }`}
            >
                {saving ? 'Saving...' : success ? <><Check size={20} /> Presence Logged</> : <><Save size={20} /> {t.submit}</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceEntry;
