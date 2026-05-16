import React from 'react';

function ProfilePage({ user }) {
  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm text-slate-600">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <p className="mt-2 text-slate-500">Your account information and role details.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-500">Name</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user.name}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user.email}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-500">Role</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user.role}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-500">Token active</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user.token ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
