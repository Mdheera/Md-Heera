
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { GraduationCap, Lock, User as UserIcon, Phone, ArrowRight } from 'lucide-react';
import { db } from '../store';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [tab, setTab] = useState<'STAFF' | 'PARENT'>('STAFF');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo Credentials
    setTimeout(() => {
      let role: UserRole | null = null;
      let name = '';

      if (username === 'admin' && password === 'admin123') {
        role = UserRole.ADMIN;
        name = 'Principal Shailesh';
      } else if (username === 'suman' && password === 'teacher123') {
        role = UserRole.TEACHER;
        name = 'Suman Kumari';
      }

      if (role) {
        onLogin({
          id: 'u_' + username,
          phone: '9999999999',
          name,
          role,
          schoolId: 'sch_01'
        });
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 800);
  };

  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit number');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      onLogin({
        id: 'u_parent',
        phone,
        name: 'Parent Account',
        role: UserRole.PARENT,
        schoolId: 'sch_01',
        studentId: 'st_c10_1' // Demo link to first student
      });
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-100">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">ResultSaathi</h1>
          <p className="text-slate-500 text-sm mt-1">Academic Intelligence Platform</p>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex p-2 bg-slate-50 border-b border-slate-100">
            <button 
              onClick={() => { setTab('STAFF'); setError(''); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${tab === 'STAFF' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Staff
            </button>
            <button 
              onClick={() => { setTab('PARENT'); setError(''); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${tab === 'PARENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Parent
            </button>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold text-center">
                {error}
              </div>
            )}

            {tab === 'STAFF' ? (
              <form onSubmit={handleStaffLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      placeholder="e.g. suman"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
                      required
                    />
                  </div>
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-100 hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50 mt-4"
                >
                  {loading ? 'Authenticating...' : 'Staff Sign In'}
                </button>
                <div className="grid grid-cols-1 gap-2 mt-4 opacity-50">
                   <div className="text-[9px] font-bold text-slate-400 text-center">Admin: admin / admin123 • Teacher: suman / teacher123</div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleParentLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
                      required
                    />
                  </div>
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-100 hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                >
                  {loading ? 'Entering Portal...' : 'Get Result Access'}
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
