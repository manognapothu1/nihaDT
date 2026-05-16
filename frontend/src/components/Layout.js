import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function Layout({ children, user, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {user ? (
        <div className="md:flex md:min-h-screen">
          <Sidebar user={user} />
          <div className="flex-1">
            <Topbar user={user} onLogout={onLogout} />
            <main className="px-4 py-5 md:px-6 md:py-6">{children}</main>
          </div>
        </div>
      ) : (
        <main className="min-h-screen flex items-center justify-center px-4 py-10">{children}</main>
      )}
    </div>
  );
}

export default Layout;
