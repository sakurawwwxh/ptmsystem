import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  id: string;
  title?: string;
  tasks: any[];
  onDetail?: (task: any) => void;
}

const columnConfig: Record<string, { bg: string; headerBg: string; title: string; countBg: string }> = {
  TODO: { bg: 'bg-slate-100', headerBg: 'bg-slate-200/60', title: '待办', countBg: 'bg-slate-300' },
  IN_PROGRESS: { bg: 'bg-blue-50', headerBg: 'bg-blue-100/60', title: '进行中', countBg: 'bg-blue-200' },
  COMPLETED: { bg: 'bg-green-50', headerBg: 'bg-green-100/60', title: '已完成', countBg: 'bg-green-200' },
};

export default function KanbanColumn({ id, tasks, onDetail }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = columnConfig[id] || columnConfig.TODO;

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 rounded-2xl transition-all duration-300 ${config.bg} ${
        isOver ? 'ring-2 ring-blue-400 ring-offset-2 scale-[1.02]' : ''
      }`}
    >
      {/* Column Header */}
      <div className={`px-4 py-3 rounded-t-2xl ${config.headerBg}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-700">{config.title}</h2>
            {id === 'TODO' && (
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {id === 'IN_PROGRESS' && (
              <svg className="w-4 h-4 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {id === 'COMPLETED' && (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <span className={`${config.countBg} text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full min-w-[24px] text-center`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="p-3 min-h-[200px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
              >
                <KanbanCard task={task} onDetail={onDetail} />
              </motion.div>
            ))}
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">暂无任务</p>
          </div>
        )}
      </div>
    </div>
  );
}
