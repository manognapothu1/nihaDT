import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Complaints', path: '/complaints' },
  { label: 'Submit', path: '/submit' },
  { label: 'Profile', path: '/profile' },
];

function Sidebar({ user }) {
  const adminItems = [
    { label: 'Dashboard', path: '/admin' },
  ];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-6 md:block">
      <div className="mb-10">
        <span className="inline-flex rounded-3xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white">Smart Hostel</span>
        <p className="mt-4 text-slate-500">{user.role === 'admin' ? 'Admin portal' : 'Student portal'}</p>
      </div>
      <nav className="space-y-2">
        {(user.role === 'admin' ? adminItems : navItems).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-3xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
              }`
            }>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
