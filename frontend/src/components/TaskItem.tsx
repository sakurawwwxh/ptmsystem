import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRepeat, faTrash } from '@fortawesome/free-solid-svg-icons';

interface TaskItemProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onStatusChange: (taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED') => void;
  onDetail: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskItem({ task, onToggleSubtask, onStatusChange, onDetail, onDelete }: TaskItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const priorityConfig = {
    P0: { bg: 'bg-red-50', text: 'text-red-600', label: '紧急' },
    P1: { bg: 'bg-orange-50', text: 'text-orange-600', label: '高' },
    P2: { bg: 'bg-blue-50', text: 'text-blue-600', label: '中' },
    P3: { bg: 'bg-slate-50', text: 'text-slate-500', label: '低' },
  };

  const statusConfig = {
    TODO: { bg: 'bg-slate-100', text: 'text-slate-600', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.P2;
  const status = statusConfig[task.status] || statusConfig.TODO;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      className="group bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 truncate">{task.title}</h3>
          {task.description && (
            <p className="text-slate-500 text-sm mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${priority.bg} ${priority.text}`}>
            {priority.label}
          </span>
          <span className={`flex items-center gap-1 text-xs ${status.bg} ${status.text} px-2 py-0.5 rounded-full`}>
            <svg className={`w-3 h-3 ${task.status === 'IN_PROGRESS' ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={status.icon} />
            </svg>
          </span>
        </div>
      </div>

      {/* Tags + Repeat */}
      <div className="flex flex-wrap gap-1.5 mb-3 items-center">
        {task.tags && task.tags.length > 0 && task.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 rounded-full border border-slate-200"
          >
            {tag}
          </span>
        ))}
        {task.repeatType && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full border border-purple-200">
            <FontAwesomeIcon icon={faRepeat} className="w-3 h-3" />
            {task.repeatType === 'DAILY' ? '每天' : task.repeatType === 'WEEKLY' ? '每周' : '每月'}
            {task.nextRepeatDate && (
              <span className="ml-1 text-purple-400">
                {new Date(task.nextRepeatDate).toLocaleDateString('zh-CN')}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="bg-slate-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">子任务</span>
            <span className="text-slate-600 font-medium">
              {task.completedSubtasks}/{task.totalSubtasks}
            </span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${(task.completedSubtasks / task.totalSubtasks) * 100}%` }}
            />
          </div>
          <div className="space-y-1.5">
            {task.subtasks.slice(0, 3).map((subtask) => (
              <label
                key={subtask.id}
                className="group/item flex items-center gap-2.5 cursor-pointer p-1.5 -mx-1.5 rounded-lg hover:bg-white transition-all duration-200"
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  subtask.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-slate-300 group-hover/item:border-cyan-400'
                }`}>
                  {subtask.completed && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => onToggleSubtask(task.id, subtask.id)}
                  className="sr-only"
                />
                <span className={`text-sm flex-1 transition-all duration-200 ${
                  subtask.completed ? 'line-through text-slate-400' : 'text-slate-700'
                }`}>
                  {subtask.title}
                </span>
              </label>
            ))}
            {task.subtasks.length > 3 && (
              <p className="text-xs text-slate-400 pl-7">+{task.subtasks.length - 3} 更多</p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className={`text-xs ${
          task.dueDate && new Date(task.dueDate) < new Date()
            ? 'text-red-500 font-medium'
            : 'text-slate-400'
        }`}>
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('zh-CN') : ''}
          {task.dueDate && new Date(task.dueDate) < new Date() && ' 已过期'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="删除任务"
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
          </button>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 hover:border-cyan-400 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="TODO">待办</option>
            <option value="IN_PROGRESS">进行中</option>
            <option value="COMPLETED">已完成</option>
          </select>
          <button onClick={() => onDetail(task)} className="text-xs text-cyan-600 hover:text-cyan-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            查看详情 →
          </button>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-2">删除任务</h3>
              <p className="text-slate-500 text-sm mb-5">确定删除「{task.title}」？删除后不可恢复。</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
                >
                  取消
                </button>
                <button
                  onClick={() => { onDelete(task.id); setShowDeleteConfirm(false); }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
