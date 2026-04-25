import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { templateApi } from '../api/tasks';
import type { Template, Task } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faRocket } from '@fortawesome/free-solid-svg-icons';
import Layout from './Layout';

export default function TemplateList() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string>('');

  const loadTemplates = async () => {
    try {
      const data = await templateApi.getTemplates() as Template[];
      setTemplates(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadTemplates(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此模板？')) return;
    try {
      await templateApi.deleteTemplate(id);
      loadTemplates();
    } catch (e) { console.error(e); }
  };

  const handleApply = async (id: string) => {
    setLoading(true);
    try {
      const task = await templateApi.applyTemplate(id) as Task;
      setToast(`任务「${task.title}」创建成功`);
      setTimeout(() => setToast(''), 3000);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingTemplate(null);
    loadTemplates();
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              任务模板
            </h1>
            <p className="text-slate-500 text-sm mt-1">保存常用任务模式，一键复用</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingTemplate(null); }}
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            新建模板
          </button>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TemplateFormModal
            template={editingTemplate}
            onClose={() => { setShowForm(false); setEditingTemplate(null); }}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      {/* Template Count */}
      {!loading && templates.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          共 {templates.length} 个模板
        </div>
      )}

      {/* Template Grid */}
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4"
          >
            <FontAwesomeIcon icon={faRocket} className="w-10 h-10 text-slate-400" />
          </motion.div>
          <h3 className="text-lg font-medium text-slate-700 mb-1">暂无模板</h3>
          <p className="text-slate-500 mb-4">创建你的第一个任务模板吧</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建模板
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
        >
          {templates.map(tpl => (
            <motion.div
              key={tpl.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } }
              }}
              layout
              whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-blue-200 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800 text-base">{tpl.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{tpl.title}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  tpl.priority === 'P0' ? 'bg-red-50 text-red-600' :
                  tpl.priority === 'P1' ? 'bg-orange-50 text-orange-600' :
                  tpl.priority === 'P2' ? 'bg-blue-50 text-blue-600' :
                  'bg-slate-50 text-slate-500'
                }`}>
                  {tpl.priority || 'P2'}
                </span>
              </div>

              {tpl.subtasks && tpl.subtasks.length > 0 && (
                <div className="mb-3 space-y-1">
                  {tpl.subtasks.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="line-clamp-1">{s.title}</span>
                    </div>
                  ))}
                  {tpl.subtasks.length > 3 && (
                    <div className="text-xs text-slate-400 ml-3">+{tpl.subtasks.length - 3} 更多</div>
                  )}
                </div>
              )}

              {tpl.repeatType && (
                <div className="mb-3">
                  <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                    {tpl.repeatType === 'DAILY' ? '每天' : tpl.repeatType === 'WEEKLY' ? '每周' : '每月'}
                  </span>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleApply(tpl.id)}
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm disabled:opacity-50"
                >
                  应用
                </button>
                <button
                  onClick={() => { setEditingTemplate(tpl); setShowForm(true); }}
                  className="px-3 py-2 bg-slate-100 text-slate-600 text-sm rounded-xl hover:bg-slate-200 transition-all"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(tpl.id)}
                  className="px-3 py-2 bg-red-50 text-red-500 text-sm rounded-xl hover:bg-red-100 transition-all"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Layout>
  );
}

interface TemplateFormModalProps {
  template?: Template | null;
  onClose: () => void;
  onSuccess: () => void;
}

function TemplateFormModal({ template, onClose, onSuccess }: TemplateFormModalProps) {
  const [name, setName] = useState(template?.name || '');
  const [title, setTitle] = useState(template?.title || '');
  const [description, setDescription] = useState(template?.description || '');
  const [priority, setPriority] = useState<'P0' | 'P1' | 'P2' | 'P3'>(template?.priority || 'P2');
  const [repeatType, setRepeatType] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | null>(template?.repeatType || null);
  const [reminderTime, setReminderTime] = useState(template?.reminderTime || '');
  const [subtasks, setSubtasks] = useState<{ title: string; completed: boolean }[]>(
    template?.subtasks?.map((s: any) => ({ title: s.title, completed: s.completed })) || []
  );
  const [newSubtask, setNewSubtask] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (template) {
        await templateApi.updateTemplate(template.id, { name, title, description, priority, repeatType, reminderTime: reminderTime || undefined, subtasks });
      } else {
        await templateApi.createTemplate({ name, title, description, priority, repeatType, reminderTime: reminderTime || undefined, subtasks });
      }
      onSuccess();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { title: newSubtask, completed: false }]);
      setNewSubtask('');
    }
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
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">{template ? '编辑模板' : '新建模板'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">模板名称</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="例如：每日站会" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">默认任务标题</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="例如：{date} 站会" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">描述</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="可选描述" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">优先级</label>
            <div className="flex gap-2">
              {(['P0', 'P1', 'P2', 'P3'] as const).map(p => {
                const colors = {
                  P0: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
                  P1: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
                  P2: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
                  P3: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
                };
                return (
                  <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-2 px-3 rounded-xl border font-medium text-sm transition-all duration-200 ${priority === p ? colors[p] : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">重复</label>
            <div className="flex gap-2">
              {[null, 'DAILY', 'WEEKLY', 'MONTHLY'].map((r, i) => {
                const label = r === null ? '不重复' : r === 'DAILY' ? '每天' : r === 'WEEKLY' ? '每周' : '每月';
                return (
                  <button key={i} type="button" onClick={() => setRepeatType(r as 'DAILY' | 'WEEKLY' | 'MONTHLY' | null)} className={`flex-1 py-2 px-3 rounded-xl border font-medium text-sm transition-all duration-200 ${repeatType === r ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {repeatType && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">提醒时间</label>
              <input
                type="datetime-local"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">默认子任务</label>
            <div className="space-y-1.5 mb-2">
              {subtasks.map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <span className="flex-1 text-sm text-slate-700">{s.title}</span>
                  <button type="button" onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 text-xs">×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newSubtask} onChange={e => setNewSubtask(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubtask())} placeholder="添加子任务" className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
              <button type="button" onClick={addSubtask} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm">+</button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-all">取消</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all disabled:opacity-50">
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}