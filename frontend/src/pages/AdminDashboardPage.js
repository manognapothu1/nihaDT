import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from '../api/axiosConfig';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function AdminDashboardPage({ user }) {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [newStatus, setNewStatus] = useState('Pending');

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/stats');
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      const response = await axios.get(`/admin/complaints?${params.toString()}`);
      setComplaints(response.data);
    } catch (err) {
      setError('Unable to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    fetchStats();
    fetchComplaints();
  }, [user]);

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setAdminNote(complaint.adminNote || '');
    setNewStatus(complaint.status);
    setModalOpen(true);
  };

  const saveChanges = async () => {
    if (!selectedComplaint) return;
    try {
      await axios.patch(`/admin/complaints/${selectedComplaint._id}/status`, {
        status: newStatus,
        adminNote,
      });
      setModalOpen(false);
      fetchStats();
      fetchComplaints();
    } catch (err) {
      setError('Unable to save changes');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm text-slate-600">
        Admin login is required to view this page.
      </div>
    );
  }

  const categoryLabels = ['electrical', 'water', 'internet', 'cleaning', 'others'];
  const categoryData = categoryLabels.map((cat) => stats?.categoryCounts?.[cat] || 0);
  const statusLabels = ['Pending', 'In Progress', 'Resolved'];
  const statusData = statusLabels.map((item) => stats?.statusCounts?.[item] || 0);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Admin analytics</p>
            <h1 className="mt-2 text-3xl font-semibold">Welcome back, Admin</h1>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            {complaints.length} complaints loaded
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Students</p>
          <p className="mt-3 text-3xl font-semibold">{stats?.totalUsers ?? '-'}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Complaints</p>
          <p className="mt-3 text-3xl font-semibold">{stats?.totalComplaints ?? '-'}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-3 text-3xl font-semibold text-amber-600">{statusData[0] ?? '-'}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Resolved</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-600">{statusData[2] ?? '-'}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Complaints by category</h2>
          <Doughnut
            data={{ labels: categoryLabels, datasets: [{ data: categoryData, backgroundColor: ['#0ea5e9', '#38bdf8', '#0f766e', '#64748b', '#1e293b'] }] }}
            options={{ plugins: { legend: { position: 'bottom' } } }}
          />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Status breakdown</h2>
          <Bar
            data={{ labels: statusLabels, datasets: [{ data: statusData, backgroundColor: ['#f59e0b', '#0ea5e9', '#22c55e'] }] }}
            options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Complaints feed</h2>
            <p className="mt-1 text-slate-500">Filter requests and add notes from the admin panel.</p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 md:w-auto md:grid-cols-3">
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400"
              placeholder="Search title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categoryLabels.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
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

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {complaints.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-4 text-slate-800">{item.title}</td>
                  <td className="px-4 py-4 text-slate-600">{item.category}</td>
                  <td className="px-4 py-4 text-slate-600">{item.userId?.email || item.userId?.name}</td>
                  <td className="px-4 py-4 text-slate-600">{item.priority}</td>
                  <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-4 text-slate-500">{new Date(item.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => openModal(item)}
                      className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && <p className="mt-4 text-slate-600">Refreshing latest requests...</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Update complaint">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Admin note</label>
            <textarea
              rows="4"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add a short update or instruction for the student"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button className="rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-700" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white" onClick={saveChanges}>
              Save changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminDashboardPage;
