import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import StatusBadge from '../components/StatusBadge';

function ComplaintListPage({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadComplaints = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (status) params.append('status', status);
      const response = await axios.get(`/complaints?${params.toString()}`);
      setComplaints(response.data);
    } catch (err) {
      setError('Unable to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
    const interval = setInterval(loadComplaints, 12000);
    return () => clearInterval(interval);
  }, [user, search, category, status]);

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm text-slate-600">
        Login first to view your complaint list.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">My Complaints</h1>
            <p className="mt-1 text-slate-500">Search, filter, and monitor your submissions.</p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 md:w-auto md:grid-cols-3">
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400"
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              <option value="electrical">Electrical</option>
              <option value="water">Water</option>
              <option value="internet">Internet</option>
              <option value="cleaning">Cleaning</option>
              <option value="others">Others</option>
            </select>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        {loading && <p className="text-slate-600">Refreshing complaint status …</p>}
        {error && <p className="text-red-600">{error}</p>}
        {complaints.length === 0 && !loading ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            No complaints match your search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-4 text-left font-medium">Title</th>
                  <th className="px-4 py-4 text-left font-medium">Category</th>
                  <th className="px-4 py-4 text-left font-medium">Priority</th>
                  <th className="px-4 py-4 text-left font-medium">Status</th>
                  <th className="px-4 py-4 text-left font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {complaints.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-4 text-slate-800">{item.title}</td>
                    <td className="px-4 py-4 text-slate-600">{item.category}</td>
                    <td className="px-4 py-4 text-slate-600">{item.priority}</td>
                    <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-4 text-slate-500">{new Date(item.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComplaintListPage;
