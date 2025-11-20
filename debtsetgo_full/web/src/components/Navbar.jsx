import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';

export default function Navbar({ userName, onLogout }) {
  const link = (to, label) => (
    <NavLink 
      to={to} 
      className={({isActive})=>`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-green-100 text-green-700 font-semibold' 
          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {label}
    </NavLink>
  );
  
  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/app" className="hover:opacity-80 transition-opacity flex items-center">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-1">
          {link('/app','Dashboard')}
          {link('/goals','Goals')}
          {link('/transactions','Transactions')}
          <NavLink 
            to="/ai-tools" 
            className={({isActive})=>`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              isActive 
                ? 'bg-green-100 text-green-700 font-semibold' 
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            AI Tools
          </NavLink>
          {link('/membership','Membership')}
          {link('/profile','Profile')}
          <button 
            onClick={onLogout} 
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors h-9 flex items-center"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

