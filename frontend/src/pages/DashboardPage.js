import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import StatusBadge from '../components/StatusBadge';

function DashboardPage({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchComplaints = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/complaints');
        setComplaints(response.data);
      } catch (err) {
        setError('Unable to load complaint data');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  const total = complaints.length;
  const resolved = complaints.filter((item) => item.status === 'Resolved').length;
  const pending = complaints.filter((item) => item.status === 'Pending').length;
  const inProgress = complaints.filter((item) => item.status === 'In Progress').length;

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <p className="mt-3 text-slate-600">Please log in to access your student dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Student dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold">Hello, {user.name}</h1>
            <p className="mt-2 text-slate-500">Track your complaints and follow progress in one place.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Complaints</p>
          <p className="mt-3 text-3xl font-semibold">{total}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Resolved</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-600">{resolved}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="mt-3 text-3xl font-semibold text-amber-600">{inProgress}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-3 text-3xl font-semibold text-slate-800">{pending}</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Recent complaints</h2>
            <p className="mt-1 text-sm text-slate-500">Latest updates from your requests.</p>
          </div>
        </div>

        {loading && <p className="mt-6 text-slate-600">Loading complaints...</p>}
        {error && <p className="mt-6 text-red-600">{error}</p>}

        {!loading && complaints.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No complaints yet. Submit your first request from the sidebar.
          </div>
        )}

        {complaints.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            <div className="grid grid-cols-1 gap-px bg-slate-200 text-sm">
              <div className="grid grid-cols-4 gap-4 bg-slate-50 px-6 py-3 font-semibold text-slate-500">
                <span>Title</span>
                <span>Category</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {complaints.slice(0, 5).map((item) => (
                <div key={item._id} className="grid grid-cols-4 gap-4 bg-white px-6 py-4">
                  <span className="font-medium text-slate-800">{item.title}</span>
                  <span className="text-slate-600">{item.category}</span>
                  <span><StatusBadge status={item.status} /></span>
                  <span className="text-slate-500">{new Date(item.updatedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
