import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { taskApi } from '../api/tasks';
import TaskItem from './TaskItem';
import TaskFilter from './TaskFilter';
import TaskForm from './TaskForm';
import TaskDetail from './TaskDetail';
import Layout from './Layout';
import type { Task } from '../types';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>();
  const [priority, setPriority] = useState<string>();
  const [tag, setTag] = useState<string>();
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [status, priority, tag]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const tasks = await taskApi.getTasks({ status, priority, tag });
      setTasks(tasks);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const previousSubtasks = [...task.subtasks];
    const updatedSubtasks = task.subtasks.map(s =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );

    // Optimistic update
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, subtasks: updatedSubtasks } : t
    ));

    try {
      await taskApi.updateSubtasks(taskId, updatedSubtasks.map(s => ({ title: s.title, completed: s.completed })));
    } catch {
      // Rollback on failure
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, subtasks: previousSubtasks } : t
      ));
    }
  };

  const handleStatusChange = async (taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED') => {
    const previousTasks = [...tasks];
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status } : t
    ));

    try {
      await taskApi.updateStatus(taskId, status);
    } catch (error) {
      console.error('Failed to update status', error);
      setTasks(previousTasks);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              我的任务
            </h1>
            <p className="text-slate-500 text-sm mt-1">管理所有任务和子任务</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建任务
          </button>
        </div>
      </div>

      {/* Filter */}
      <TaskFilter
        status={status}
        priority={priority}
        tag={tag}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onTagChange={setTag}
      />

      {/* Task Count */}
      {!loading && (
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          共 {tasks.length} 个任务
          {(status || priority || tag) && (
            <span className="text-blue-600">(已筛选)</span>
          )}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-500 animate-pulse">加载中...</p>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-1">暂无任务</h3>
          <p className="text-slate-500 mb-4">点击上方按钮创建你的第一个任务</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建任务
          </button>
        </div>
      ) : (
        /* Task List */
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
            >
              <TaskItem
                task={task}
                onToggleSubtask={(tid, sid) => handleToggleSubtask(tid, sid)}
                onStatusChange={handleStatusChange}
                onDetail={setSelectedTask}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      )}

      {showForm && <TaskForm onClose={() => setShowForm(false)} onSuccess={fetchTasks} />}
      {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} onUpdate={fetchTasks} onDelete={handleDelete} />}
    </Layout>
  );
}
