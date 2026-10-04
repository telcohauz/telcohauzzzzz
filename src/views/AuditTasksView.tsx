import React, { useState, useEffect } from 'react';
import { CheckSquare2, Plus, Search, Filter, AlertCircle, Clock, CheckCircle2, User } from 'lucide-react';
import { AuditTask, AuditTaskStatus, TaskPriority } from '../types/index.ts';

interface Props {
  onRefreshStats: () => void;
}

export const AuditTasksView: React.FC<Props> = ({ onRefreshStats }) => {
  const [tasksList, setTasksList] = useState<AuditTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState('SSM Check');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [assignedTo, setAssignedTo] = useState('Lead Forensic Auditor');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  // Status Update modal
  const [selectedTask, setSelectedTask] = useState<AuditTask | null>(null);
  const [updateStatus, setUpdateStatus] = useState<AuditTaskStatus>('Completed');
  const [updateResult, setUpdateResult] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        setTasksList(await res.json());
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: taskTitle,
          category,
          priority,
          assignedTo,
          dueDate,
          notes,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setTaskTitle('');
        setDueDate('');
        setNotes('');
        await fetchTasks();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    try {
      const res = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updateStatus,
          result: updateResult,
        }),
      });

      if (res.ok) {
        setSelectedTask(null);
        setUpdateResult('');
        await fetchTasks();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statuses: AuditTaskStatus[] = [
    'To Do',
    'Researching',
    'Waiting Verification',
    'Verified',
    'Completed',
    'Blocked',
  ];

  const filtered = tasksList.filter((t) => {
    const matchSearch =
      t.task.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.assignedTo && t.assignedTo.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare2 className="w-5 h-5 text-indigo-400" />
            Audit Action Tasks & Verification Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal task management system tracking forensic investigation items, statutory renewals, and channel audits.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-900/40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Audit Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit tasks or assignees..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-mono">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg">
            <span className="text-slate-500 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg">
            <span className="text-slate-500 text-[11px]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-hidden"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading audit tasks...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
          No audit tasks matching the filter criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${
                    item.priority === 'Urgent'
                      ? 'bg-rose-950 text-rose-300 border-rose-800/60 animate-pulse'
                      : item.priority === 'High'
                      ? 'bg-orange-950 text-orange-300 border-orange-800/60'
                      : item.priority === 'Medium'
                      ? 'bg-blue-950 text-blue-300 border-blue-800/60'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {item.priority}
                  </span>

                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                    {item.category}
                  </span>

                  {item.dueDate && (
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Due: {item.dueDate}
                    </span>
                  )}
                </div>

                <h2 className="text-sm font-bold text-white">{item.task}</h2>

                {item.notes && (
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.notes}</p>
                )}

                {item.result && (
                  <div className="mt-1 p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400">
                    Result: {item.result}
                  </div>
                )}
              </div>

              {/* Status and Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold ${
                  item.status === 'Completed'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : item.status === 'Researching'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : item.status === 'Blocked'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {item.status}
                </span>

                <button
                  onClick={() => {
                    setSelectedTask(item);
                    setUpdateStatus(item.status);
                    setUpdateResult(item.result || '');
                  }}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Create Forensic Audit Task</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Assign verification tasks to research, cross-check, or validate channels.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Task Headline *</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Verify SSM Annual Renewal Status for 2026/2027"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="SSM Check">SSM / Statutory Check</option>
                    <option value="Domain Verification">Domain & DNS Verification</option>
                    <option value="Social Audit">Social Account Audit</option>
                    <option value="Review Audit">Customer Review Audit</option>
                    <option value="Marketplace Verification">Marketplace Channel Verification</option>
                    <option value="Relationship Mapping">Relationship Mapping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Assigned To</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Auditor Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Due Date</label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-hidden font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Scope & Research Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specific queries, evidence required, or external links..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Task Status Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Update Task Status</h2>
            <div className="text-xs text-slate-300 font-medium mb-4 p-3 bg-slate-950 border border-slate-800 rounded-xl">
              {selectedTask.task}
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as AuditTaskStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Audit Result / Findings</label>
                <textarea
                  rows={3}
                  value={updateResult}
                  onChange={(e) => setUpdateResult(e.target.value)}
                  placeholder="Record summary of result, resolution, or evidence reference..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
