import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { taskApi, relationApi } from '../api/tasks';
import type { Task } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
  onDelete?: (taskId: string) => void;
}

interface Relation {
  id: string;
  sourceTaskId: string;
  targetTaskId: string;
  relationType: string;
  createdAt?: string;
}

export default function TaskDetail({ task, onClose, onUpdate, onDelete }: TaskDetailProps) {
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [relatedTasks, setRelatedTasks] = useState<Record<string, Task>>({});
  const [showRelations, setShowRelations] = useState(false);
  const [showAddRelation, setShowAddRelation] = useState(false);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [newRelationType, setNewRelationType] = useState<string>('BLOCKS');
  const [targetTaskId, setTargetTaskId] = useState<string>('');
  const [statusError, setStatusError] = useState<string>('');
  const [relationError, setRelationError] = useState<string>('');
  
  useEffect(() => {
    setSubtasks(task.subtasks || []);
    loadRelations();
    loadAllTasks();
  }, [task.id]);

  const loadAllTasks = async () => {
    try {
      const tasks = await taskApi.getTasks();
      setAllTasks(tasks.filter(t => t.id !== task.id));
      const taskMap: Record<string, Task> = {};
      tasks.forEach(t => { taskMap[t.id] = t; });
      setRelatedTasks(taskMap);
    } catch (e) {
      console.error(e);
    }
  };

  const loadRelations = async () => {
    try {
      const data = await relationApi.getRelations(task.id) as Relation[];
      setRelations(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  
  const handleAddRelation = async () => {
    if (!targetTaskId || !newRelationType) return;
    setRelationError('');
    try {
      await relationApi.createRelation(task.id, targetTaskId, newRelationType);
      setTargetTaskId('');
      setShowAddRelation(false);
      setShowRelations(true);
      loadRelations();
      onUpdate();
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || '';
      if (msg.includes('循环') || msg.includes('死锁')) {
        setRelationError(msg);
      } else {
        console.error(e);
      }
    }
  };

  const toggleSubtask = async (subtaskId: string) => {
    const updated = subtasks.map(s =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    setSubtasks(updated);
    await taskApi.updateSubtasks(task.id, updated.map(s => ({ title: s.title, completed: s.completed })));
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    const updated = subtasks.filter(s => s.id !== subtaskId);
    setSubtasks(updated);
    await taskApi.updateSubtasks(task.id, updated.map(s => ({ title: s.title, completed: s.completed })));
    onUpdate();
  };

  const handleDeleteRelation = async (relationId: string) => {
    try {
      await relationApi.deleteRelation(relationId);
      loadRelations();
      onUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  const getRelatedTaskId = (rel: Relation) => {
    return rel.sourceTaskId === task.id ? rel.targetTaskId : rel.sourceTaskId;
  };

  const getRelationLabel = (type: string) => {
    switch (type) {
      case 'BLOCKS': return { text: '阻塞', bg: 'bg-red-50 text-red-600' };
      case 'DEPENDS_ON': return { text: '依赖', bg: 'bg-orange-50 text-orange-600' };
      case 'RELATED_TO': return { text: '关联', bg: 'bg-blue-50 text-blue-600' };
      default: return { text: type, bg: 'bg-slate-50 text-slate-600' };
    }
  };

  const getRelatedTasks = () => {
    return relations.map(rel => {
      const relatedId = getRelatedTaskId(rel);
      const relatedTask = relatedTasks[relatedId];
      return {
        ...rel,
        relatedTask
      };
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-slate-800">任务详情</h2>
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={() => { if (confirm('确定删除此任务？')) onDelete(task.id); }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="删除任务"
              >
                <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title & Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800">{task.title}</h3>
              {task.description && <p className="text-slate-500 mt-2">{task.description}</p>}
            </div>
            <select
              value={task.status}
              onChange={async (e) => {
                setStatusError('');
                try {
                  const result = await taskApi.updateStatus(task.id, e.target.value);
                  if (result === null) {
                    onClose();
                  } else {
                    onUpdate();
                  }
                } catch (err: any) {
                  const msg = err?.response?.data?.message || err?.message || '';
                  if (msg.includes('阻塞')) {
                    setStatusError(msg);
                  } else {
                    console.error(err);
                  }
                }
              }}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium"
            >
              <option value="TODO">待办</option>
              <option value="IN_PROGRESS">进行中</option>
              <option value="COMPLETED">已完成</option>
            </select>
          </div>

          {statusError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{statusError}</p>
              <p className="text-xs text-red-400 mt-1">请先完成阻塞的任务</p>
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              task.priority === 'P0' ? 'bg-red-50 text-red-600' :
              task.priority === 'P1' ? 'bg-orange-50 text-orange-600' :
              task.priority === 'P2' ? 'bg-blue-50 text-blue-600' :
              'bg-slate-50 text-slate-500'
            }`}>
              {task.priority}
            </span>
            {task.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                {tag}
              </span>
            ))}
            {task.repeatType && (
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                {task.repeatType === 'DAILY' ? '每天' : task.repeatType === 'WEEKLY' ? '每周' : '每月'}
              </span>
            )}
          </div>

          {/* Subtasks */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="font-medium text-slate-700 mb-3">
              子任务 ({subtasks.filter(s => s.completed).length}/{subtasks.length})
            </h4>

            {subtasks.length === 0 ? (
              <p className="text-sm text-slate-400">暂无子任务</p>
            ) : (
              <div className="space-y-2">
                {subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors">
                    <button
                      onClick={() => toggleSubtask(subtask.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        subtask.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-cyan-400'
                      }`}
                    >
                      {subtask.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {subtask.title}
                    </span>
                    <button
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="text-xs text-slate-300 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Relations */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-700">
                关联任务 ({relations.length})
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddRelation(!showAddRelation)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showAddRelation ? '取消' : '+ 添加'}
                </button>
                <button
                  onClick={() => setShowRelations(!showRelations)}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  {showRelations ? '收起' : '查看'}
                </button>
              </div>
            </div>

            {showAddRelation && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg space-y-3">
                <select
                  value={newRelationType}
                  onChange={(e) => setNewRelationType(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="BLOCKS">阻塞 - 此任务阻塞所选任务</option>
                  <option value="DEPENDS_ON">依赖 - 此任务依赖所选任务</option>
                  <option value="RELATED_TO">关联 - 此任务关联所选任务</option>
                </select>
                <select
                  value={targetTaskId}
                  onChange={(e) => setTargetTaskId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">选择任务...</option>
                  {allTasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button onClick={handleAddRelation} disabled={!targetTaskId} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    确认
                  </button>
                  <button onClick={() => setShowAddRelation(false)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-slate-200">
                    取消
                  </button>
                </div>
                {relationError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600">{relationError}</p>
                  </div>
                )}
              </div>
            )}

            {showRelations && (
              relations.length === 0 ? (
                <p className="text-sm text-slate-400">暂无关联任务</p>
              ) : (
                <div className="space-y-2">
                  {getRelatedTasks().map((item) => {
                    const rel = item as Relation;
                    const label = getRelationLabel(rel.relationType);
                    return (
                      <div key={rel.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-0.5 rounded ${label.bg}`}>
                            {label.text}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-700">
                              {item.relatedTask?.title || '未知任务'}
                            </span>
                            {item.relatedTask && (
                              <span className={`text-xs ${
                                item.relatedTask.status === 'COMPLETED' ? 'text-green-500' :
                                item.relatedTask.status === 'IN_PROGRESS' ? 'text-blue-500' :
                                'text-slate-400'
                              }`}>
                                {item.relatedTask.status === 'TODO' ? '待办' :
                                 item.relatedTask.status === 'IN_PROGRESS' ? '进行中' : '已完成'}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteRelation(rel.id)}
                          className="text-xs text-slate-400 hover:text-red-500 p-1"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
