import React from 'react';

function Topbar({ user, onLogout }) {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Logged in as</p>
          <h2 className="text-xl font-semibold text-slate-900">{user?.name}</h2>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
