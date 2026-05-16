import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import Toast from '../components/Toast';

function SubmitComplaintPage({ user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('electrical');
  const [urgent, setUrgent] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return setToast({ type: 'error', message: 'Please login to submit a complaint' });
    if (!title || !description) return setToast({ type: 'error', message: 'Title and description are required' });

    setLoading(true);
    try {
      const image = imageFile ? await readFileAsDataURL(imageFile) : undefined;
      await axios.post('/complaints', { title, description, category, urgent, image });
      setToast({ type: 'success', message: 'Complaint submitted successfully' });
      setTitle('');
      setDescription('');
      setCategory('electrical');
      setUrgent(false);
      setImageFile(null);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Unable to submit complaint' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Submit a new complaint</h1>
            <p className="mt-1 text-slate-500">Share the issue with the hostel team and track progress.</p>
          </div>
          <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sky-700">Smart form</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-sm space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. Water supply issue in room 401"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            rows="5"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write the details of the issue"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="electrical">Electrical</option>
              <option value="water">Water</option>
              <option value="internet">Internet</option>
              <option value="cleaning">Cleaning</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              Mark as urgent
            </label>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Upload image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
          />
          {imageFile && <p className="mt-2 text-sm text-slate-600">Selected file: {imageFile.name}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400">
          {loading ? 'Sending complaint …' : 'Submit complaint'}
        </button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default SubmitComplaintPage;
