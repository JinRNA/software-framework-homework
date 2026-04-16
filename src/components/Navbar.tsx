import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, FileText, Target, LayoutDashboard, Sparkles } from 'lucide-react';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/assessment', label: '测评大厅', icon: ClipboardList },
  { path: '/report', label: '深度报告', icon: FileText },
  { path: '/selection', label: '职业方向', icon: Target },
  { path: '/dashboard', label: '数据看板', icon: LayoutDashboard },
];

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="container mx-auto max-w-7xl">
        <div className="glass-panel flex items-center justify-between h-16 px-6 shadow-xl">
          <Link to="/" className="flex flex-row items-center gap-2 hover:opacity-80 transition-opacity">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="font-extrabold text-lg tracking-wide text-white text-contrast-shadow">
              人才素描
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-white/30' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/70'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
