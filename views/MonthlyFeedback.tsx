
import React, { useState } from 'react';
import { db } from '../store';
import { Student, StudentFeedback, Language } from '../types';
import { MessageSquare, Search, Save, Sparkles, ChevronRight } from 'lucide-react';
import { getEnhancedFeedback } from '../services/geminiService';
import { translations } from '../translations';

const MonthlyFeedback: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];
  const [selectedClass, setSelectedClass] = useState<string>('c10');
  const [searchQuery, setSearchQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedbackData, setFeedbackData] = useState<Record<string, string>>({});

  const classes = db.getClasses();
  const students = db.getStudents(selectedClass);
  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNumber.includes(searchQuery));

  const handleSaveFeedback = async (student: Student) => {
    const comment = feedbackData[student.id];
    if (!comment) return;
    setSavingId(student.id);
    
    try {
        const enhanced = await getEnhancedFeedback(comment, lang);
        const fb: StudentFeedback = {
            id: `fb_${Date.now()}`,
            studentId: student.id,
            teacherId: 'current_teacher',
            month: 'June 2024',
            comment,
            aiEnhancedComment: enhanced,
            timestamp: Date.now()
        };
        db.saveFeedback(fb);
        setSavingId(null);
        // Visual feedback
        setFeedbackData({...feedbackData, [student.id]: ''});
    } catch (e) {
        setSavingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t.feedback} Entry</h2>
          <p className="text-slate-400 font-bold mt-1 text-[10px] uppercase tracking-widest">Monthly Growth Observation</p>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {classes.map(c => (
                <button 
                    key={c.id} 
                    onClick={() => setSelectedClass(c.id)}
                    className={`px-6 py-2 rounded-xl font-black text-[10px] transition-all uppercase tracking-widest ${selectedClass === c.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    {c.name}th
                </button>
            ))}
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
            type="text" 
            placeholder={t.search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-3xl shadow-sm outline-none focus:border-emerald-500 font-bold transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStudents.map(s => (
            <div key={s.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black">
                        {s.rollNumber}
                    </div>
                    <div>
                        <p className="font-black text-slate-800">{s.name}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scholar No. {s.id.slice(-4)}</p>
                    </div>
                </div>
                
                <textarea 
                    placeholder={t.feedback_placeholder}
                    value={feedbackData[s.id] || ''}
                    onChange={(e) => setFeedbackData({...feedbackData, [s.id]: e.target.value})}
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl min-h-[100px] outline-none focus:border-emerald-500 font-medium text-slate-700 transition-all text-sm mb-4"
                />
                
                <button 
                    onClick={() => handleSaveFeedback(s)}
                    disabled={savingId === s.id || !feedbackData[s.id]}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-30"
                >
                    {savingId === s.id ? (
                        <>Processing Insight...</>
                    ) : (
                        <><Sparkles size={14} /> Interpret & Save</>
                    )}
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyFeedback;
