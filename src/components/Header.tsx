import React from 'react';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-100 shadow-sm sm:px-6 lg:px-8">
      <div className="flex items-center flex-1">
        {/* Logo fictício */}
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-bold text-lg shadow-card">
          AV
        </div>
        <h1 className="ml-4 text-xl font-bold tracking-tight text-secondary">Sistema Reserva Alta Vista</h1>
        {children && <div className="ml-4">{children}</div>}
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-secondary">JOÃO MARCELO</span>
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold shadow-card">
          A
        </div>
      </div>
    </header>
  );
};

export default Header;