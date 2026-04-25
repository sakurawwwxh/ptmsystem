import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { taskApi } from '../api/tasks';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import TaskForm from './TaskForm';
import TaskDetail from './TaskDetail';
import Layout from './Layout';
import type { Task } from '../types';

const COLUMNS = [
  { id: 'TODO', title: '待办' },
  { id: 'IN_PROGRESS', title: '进行中' },
  { id: 'COMPLETED', title: '已完成' },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => { fetchTasks(); }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const tasks = await taskApi.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      showToast('加载任务失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: any) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    if (newStatus === 'TODO' || newStatus === 'IN_PROGRESS' || newStatus === 'COMPLETED') {
      const task = tasks.find(t => t.id === taskId);
      if (!task || task.status === newStatus) return;

      const previousTasks = [...tasks];
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus as Task['status'] } : t
      ));

      try {
        await taskApi.updateStatus(taskId, newStatus);
        showToast('状态已更新', 'success');
      } catch (error) {
        console.error('Failed to update status', error);
        setTasks(previousTasks);
        showToast('状态更新失败', 'error');
      }
    }
  };

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  return (
    <Layout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-right ${
          toast.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              我的看板
            </h1>
            <p className="text-slate-500 text-sm mt-1">拖拽任务卡片到不同列以更新状态</p>
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
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-1">看板是空的</h3>
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
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {COLUMNS.map((col) => (
              <KanbanColumn key={col.id} id={col.id} tasks={getTasksByStatus(col.id)} onDetail={setSelectedTask} />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? <KanbanCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Task Stats */}
      {!loading && tasks.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-sm text-slate-600">总计</span>
            <span className="text-lg font-semibold text-slate-800">{tasks.length}</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm text-slate-600">P0</span>
            <span className="text-lg font-semibold text-slate-800">{tasks.filter(t => t.priority === 'P0').length}</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-sm text-slate-600">P1</span>
            <span className="text-lg font-semibold text-slate-800">{tasks.filter(t => t.priority === 'P1').length}</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-slate-600">已完成</span>
            <span className="text-lg font-semibold text-slate-800">{tasks.filter(t => t.status === 'COMPLETED').length}</span>
          </div>
        </div>
      )}

      {showForm && <TaskForm onClose={() => setShowForm(false)} onSuccess={fetchTasks} />}
      {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} onUpdate={fetchTasks} />}
    </Layout>
  );
}
