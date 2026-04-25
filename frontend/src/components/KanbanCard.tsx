import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

interface KanbanCardProps {
  task: any;
  isDragging?: boolean;
  onDetail?: (task: any) => void;
}

export default function KanbanCard({ task, isDragging, onDetail }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityConfig = {
    P0: { border: 'border-l-red-500', bg: 'bg-red-50', text: 'text-red-600', label: '紧急' },
    P1: { border: 'border-l-orange-500', bg: 'bg-orange-50', text: 'text-orange-600', label: '高' },
    P2: { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-600', label: '中' },
    P3: { border: 'border-l-gray-500', bg: 'bg-slate-50', text: 'text-slate-500', label: '低' },
  };

  const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.P2;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: isDragging ? 1.05 : 1 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }}
      className={`group relative bg-white rounded-xl shadow-sm border-l-4 ${priority.border} p-4 cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5
        ${isDragging ? 'shadow-2xl rotate-2' : ''}`}
    >
      {/* Priority Badge */}
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.bg} ${priority.text}`}>
          {priority.label}
        </span>
        {task.totalSubtasks > 0 && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {task.completedSubtasks}/{task.totalSubtasks}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 mb-1">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-slate-500 text-sm line-clamp-2 mb-2">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${
          new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-slate-400'
        }`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(task.dueDate).toLocaleDateString('zh-CN')}
          {new Date(task.dueDate) < new Date() && <span className="text-red-400">已过期</span>}
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

      {/* Detail Button */}
      {onDetail && (
        <button
          onClick={(e) => { e.stopPropagation(); onDetail(task); }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}
