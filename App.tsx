
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { db } from './store';
import { User, UserRole, Language } from './types';
import Dashboard from './views/Dashboard';
import ParentDashboard from './views/ParentDashboard';
import MarksEntry from './views/MarksEntry';
import AttendanceEntry from './views/AttendanceEntry';
import MonthlyFeedback from './views/MonthlyFeedback';
import AdminSetup from './views/AdminSetup';
import { translations } from './translations';
import { 
  LayoutDashboard, ClipboardList, Settings, 
  CalendarCheck, UserRound, GraduationCap,
  MessageSquare, Globe, ChevronRight, User as UserIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  // Initialize with a default Admin user for the demo
  const [user, setUser] = useState<User>({
    id: 'demo_user',
    phone: '9999999999',
    name: 'Principal Shailesh',
    role: UserRole.ADMIN,
    schoolId: 'sch_01'
  });

  const handleSwitchRole = (role: UserRole) => {
    const names = { 
      [UserRole.ADMIN]: 'Principal Shailesh', 
      [UserRole.TEACHER]: 'Suman Kumari', 
      [UserRole.PARENT]: 'Parent of Aman' 
    };
    const studentId = role === UserRole.PARENT ? 'st_c10_1' : undefined;
    setUser({ ...user, role, name: names[role], studentId });
  };

  const t = translations[lang];
  const isAdmin = user.role === UserRole.ADMIN;
  const isTeacher = user.role === UserRole.TEACHER;
  const isParent = user.role === UserRole.PARENT;
  const theme = isAdmin ? 'indigo' : isTeacher ? 'emerald' : 'rose';

  return (
    <HashRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#F9FBFF]">
        {/* Navigation Sidebar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-2 md:relative md:h-screen md:w-64 md:flex-col md:justify-start md:border-t-0 md:border-r md:p-6 z-50">
          <div className="hidden md:flex items-center gap-3 mb-10 px-2">
            <div className={`p-2 bg-${theme}-600 rounded-xl text-white shadow-lg shadow-${theme}-100`}>
              <GraduationCap size={22} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">ResultSaathi</h1>
          </div>

          <nav className="flex flex-row md:flex-col gap-1 w-full">
            {(isParent ? [
              { to: '/', label: t.dashboard, icon: <UserRound size={18} /> }
            ] : [
              { to: '/', label: t.dashboard, icon: <LayoutDashboard size={18} /> },
              { to: '/marks', label: t.marks_entry, icon: <ClipboardList size={18} /> },
              { to: '/attendance', label: t.attendance, icon: <CalendarCheck size={18} /> },
              { to: '/feedback', label: t.feedback, icon: <MessageSquare size={18} /> }
            ]).map(link => (
              <SidebarLink key={link.to} {...link} theme={theme} />
            ))}
            {isAdmin && <SidebarLink to="/setup" label={t.setup} icon={<Settings size={18} />} theme={theme} />}
          </nav>

          <div className="hidden md:block mt-auto space-y-6 pt-6 border-t border-slate-50">
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 px-2">Language</p>
              <div className="flex bg-slate-50 p-1 rounded-xl">
                {(['en', 'hi', 'hinglish'] as Language[]).map(l => (
                  <button 
                    key={l} 
                    onClick={() => setLang(l)}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${lang === l ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-500'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 pb-24 md:pb-0 overflow-auto">
          {/* Persona Bar */}
          <div className="bg-white/70 backdrop-blur-md border-b border-slate-50 sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full bg-${theme}-100 flex items-center justify-center text-${theme}-600`}>
                <UserIcon size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active View</p>
                <p className="text-xs font-bold text-slate-700">{user.name}</p>
              </div>
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <PersonaBtn active={isAdmin} label="Principal" onClick={() => handleSwitchRole(UserRole.ADMIN)} color="indigo" />
              <PersonaBtn active={isTeacher} label="Teacher" onClick={() => handleSwitchRole(UserRole.TEACHER)} color="emerald" />
              <PersonaBtn active={isParent} label="Parent" onClick={() => handleSwitchRole(UserRole.PARENT)} color="rose" />
            </div>
          </div>

          <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <Routes>
              {isParent ? (
                <Route path="/" element={<ParentDashboard user={user} lang={lang} />} />
              ) : (
                <>
                  <Route path="/" element={<Dashboard user={user} lang={lang} />} />
                  <Route path="/marks" element={<MarksEntry lang={lang} />} />
                  <Route path="/attendance" element={<AttendanceEntry lang={lang} />} />
                  <Route path="/feedback" element={<MonthlyFeedback lang={lang} />} />
                  <Route path="/setup" element={isAdmin ? <AdminSetup /> : <Navigate to="/" />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

const SidebarLink = ({ to, label, icon, theme }: any) => {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link to={to} className={`flex flex-col md:flex-row items-center gap-2 md:gap-3 p-3 rounded-xl transition-all ${active ? `text-${theme}-600 bg-${theme}-50/50` : 'text-slate-500 hover:bg-slate-50'}`}>
      {icon}
      <span className="text-[9px] md:text-sm font-bold">{label}</span>
    </Link>
  );
};

const PersonaBtn = ({ active, label, onClick, color }: any) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${active ? `bg-${color}-600 text-white shadow-md` : 'text-slate-400 hover:text-slate-600'}`}>
    {label}
  </button>
);

export default App;
