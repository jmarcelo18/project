import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from '../pages/Dashboard';
import Companies from '../pages/Companies';
import ServiceCalls from '../pages/ServiceCalls';
import VisitHistory from '../pages/VisitHistory';
import AVCB from '../pages/AVCB';
import Budgets from '../pages/Budgets';
import Header from './Header';
import { Menu } from 'lucide-react';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 rounded-md lg:hidden hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
        </Header>
        
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/service-calls" element={<ServiceCalls />} />
              <Route path="/visit-history" element={<VisitHistory />} />
              <Route path="/avcb" element={<AVCB />} />
              <Route path="/budgets" element={<Budgets />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;