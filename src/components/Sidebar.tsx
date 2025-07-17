import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  PhoneCall, 
  ClipboardList, 
  ShieldCheck,
  X,
  Receipt
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Empresas Especializadas', path: '/companies', icon: <Building2 size={20} /> },
    { name: 'Chamados Sinco', path: '/service-calls', icon: <PhoneCall size={20} /> },
    { name: 'Histórico de Visitas', path: '/visit-history', icon: <ClipboardList size={20} /> },
    { name: 'AVCB', path: '/avcb', icon: <ShieldCheck size={20} /> },
    { name: 'Orçamentos', path: '/budgets', icon: <Receipt size={20} /> },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-20 transition-opacity bg-gray-600 bg-opacity-75 lg:hidden ${
          isOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-secondary lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-wider text-primary">Alta Vista</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 text-primary rounded-md lg:hidden hover:text-white hover:bg-primary/80 transition"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="px-2 mt-5 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 gap-2 select-none shadow-none ${
                  isActive
                    ? 'bg-primary text-white shadow-card'
                    : 'text-blue-100 hover:bg-primary/20 hover:text-white'
                }`
              }
            >
              <span className="mr-2">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;