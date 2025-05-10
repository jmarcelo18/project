import React from 'react';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
      <div className="flex items-center flex-1">
        {children}
        <h1 className="ml-4 text-lg font-semibold text-gray-800">Sistema Reserva Alta Vista</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">JOÃO MARCELO</span>
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
          A
        </div>
      </div>
    </header>
  );
};

export default Header;