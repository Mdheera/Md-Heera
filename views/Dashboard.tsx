
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../store';
import { User, Language } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ClipboardList, CalendarCheck, Target, Sparkles, TrendingUp } from 'lucide-react';
import { getStrategicInstitutionalInsight } from '../services/geminiService';
import { translations } from '../translations';

const Dashboard: React.FC<{ user: User, lang: Language }> = ({ user, lang }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const t = translations[lang];

  const classes = db.getClasses();
  const students = db.getStudents();
  const tests = db.getTests();
  const marks = db.getMarks();

  const stats = useMemo(() => {
    return classes.map(c => {
      const classTests = tests.filter(test => test.classId === c.id);
      const testIds = classTests.map(t => t.id);
      const cMarks = marks.filter(m => testIds.includes(m.testId));
      const avg = cMarks.length > 0 ? cMarks.reduce((a, b) => a + b.obtainedMarks, 0) / cMarks.length : 0;
      return { name: `${c.name}th`, score: Math.round(avg) };
    });
  }, [classes, marks, tests]);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      const schoolSummary = { stats, enrollment: students.length };
      const res = await getStrategicInstitutionalInsight(schoolSummary, lang);
      setInsight(res);
      setLoading(false);
    };
    fetchInsight();
  }, [lang]);

  const isAdmin = user.role === 'ADMIN';
  const theme = isAdmin ? 'indigo' : 'emerald';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Institutional Overview</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Academic Year 2024-25</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Scholars', value: students.length, icon: <Users size={18} />, color: 'blue' },
          { label: 'Avg Achievement', value: '78%', icon: <Target size={18} />, color: 'emerald' },
          { label: 'Hazari (Presence)', value: '91%', icon: <CalendarCheck size={18} />, color: 'amber' },
          { label: 'Tests Logged', value: tests.length, icon: <ClipboardList size={18} />, color: 'purple' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`w-9 h-9 bg-${card.color}-50 rounded-lg flex items-center justify-center text-${card.color}-600 mb-4`}>
              {card.icon}
            </div>
            <p className="text-2xl font-black text-slate-800 tracking-tight">{card.value}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-amber-400 rounded-xl text-slate-900">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest">Active Intelligence</h3>
          </div>
          <div className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            {loading ? (
                <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                    <span>Processing institutional data trends...</span>
                </div>
            ) : (
                <p className="italic font-medium">"{insight}"</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-500" /> Comparative Performance
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                        <Bar dataKey="score" fill={isAdmin ? '#4f46e5' : '#059669'} radius={[8, 8, 8, 8]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-8">Scholar Recognition</h3>
            <div className="space-y-4">
                {students.slice(0, 4).map((s, idx) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-50">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-300">#0{idx+1}</span>
                            <p className="text-xs font-bold text-slate-700">{s.name}</p>
                        </div>
                        <span className={`text-[10px] font-black text-${theme}-600 uppercase tracking-widest`}>Top 5%</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
