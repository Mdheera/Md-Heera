
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../store';
import { User, Language } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, BookOpen, MessageCircle, Heart, Zap } from 'lucide-react';
import { getAutoInsight } from '../services/geminiService';
import { translations } from '../translations';

const ParentDashboard: React.FC<{ user: User, lang: Language }> = ({ user, lang }) => {
  const [pulse, setPulse] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const t = translations[lang];

  const child = db.getStudents().find(s => s.id === user.studentId);
  const childMarks = db.getMarks().filter(m => m.studentId === user.studentId);
  const attendance = db.getAttendance(user.studentId);
  const feedback = db.getFeedback(user.studentId);
  const subjects = db.getSubjects(child?.classId);
  const tests = db.getTests(child?.classId);

  const attendanceRate = useMemo(() => {
    if (attendance.length === 0) return 92; // Demo fallback
    const presentCount = attendance.filter(a => a.status === 'PRESENT').length;
    return Math.round((presentCount / attendance.length) * 100);
  }, [attendance]);

  const progressData = useMemo(() => {
    return tests.map(test => {
      const tMarks = childMarks.filter(m => m.testId === test.id);
      if (tMarks.length === 0) return { name: test.name, percentage: 0 };
      const total = tMarks.reduce((acc, curr) => acc + curr.obtainedMarks, 0);
      const possible = tMarks.length * test.maxMarks;
      return { name: test.name, percentage: Math.round((total / possible) * 100) };
    }).filter(d => d.percentage > 0);
  }, [tests, childMarks]);

  useEffect(() => {
    const fetchPulse = async () => {
      if (!child) return;
      setLoading(true);
      const data = {
        name: child.name,
        attendance: `${attendanceRate}%`,
        latestMarks: childMarks.slice(-3),
        latestFeedback: feedback.slice(-1)[0]?.comment
      };
      const res = await getAutoInsight(data, lang);
      setPulse(res);
      setLoading(false);
    };
    fetchPulse();
  }, [child, lang]);

  if (!child) return <div className="p-20 text-center font-bold text-slate-300">Scholar Profile Not Linked</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-rose-600 rounded-[32px] p-8 text-white shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
          <Award size={40} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-black tracking-tight">{child.name}</h2>
          <div className="flex justify-center md:justify-start gap-4 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-black/10 px-3 py-1.5 rounded-lg border border-white/5">Roll: {child.rollNumber}</span>
            <span className="text-[10px] font-black uppercase tracking-widest bg-black/10 px-3 py-1.5 rounded-lg border border-white/5">Grade {child.classId.replace('c','')}</span>
          </div>
        </div>
        <div className="flex gap-8">
            <StatSmall label="Presence" val={attendanceRate + '%'} />
            <StatSmall label="Level" val="B+" />
        </div>
      </div>

      <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-500 rounded-lg">
                <Heart size={18} fill="currentColor" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest">{t.ai_strategy}</h3>
        </div>
        <div className="text-sm leading-relaxed text-slate-300 min-h-[60px]">
            {loading ? (
                <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                    <span>Syncing scholar pulse...</span>
                </div>
            ) : (
                <p className="italic">"{pulse}"</p>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                <Zap size={18} className="text-rose-500" /> Learning Trajectory
            </h3>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} />
                        <YAxis axisLine={false} tickLine={false} unit="%" tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} />
                        <Line type="monotone" dataKey="percentage" stroke="#f43f5e" strokeWidth={4} dot={{r: 5, fill: '#f43f5e'}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                <MessageCircle size={18} className="text-rose-500" /> Recent Feedback
            </h3>
            <div className="space-y-4">
                {feedback.length > 0 ? feedback.slice(-2).map(fb => (
                    <div key={fb.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">{fb.month}</p>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"{fb.comment}"</p>
                    </div>
                )) : <div className="p-10 text-center text-[10px] font-black text-slate-300 uppercase italic">Awaiting monthly update</div>}
            </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
            <BookOpen size={18} className="text-rose-500" /> Academic Scores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjects.map(sub => {
                const mark = childMarks.find(m => m.subjectId === sub.id);
                const score = mark ? mark.obtainedMarks : 0;
                return (
                    <div key={sub.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{sub.name}</p>
                        <p className="text-2xl font-black text-slate-800">{score}<span className="text-xs text-slate-300 ml-1">/100</span></p>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

const StatSmall = ({ label, val }: any) => (
    <div className="text-center">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
        <p className="text-2xl font-black">{val}</p>
    </div>
);

export default ParentDashboard;
