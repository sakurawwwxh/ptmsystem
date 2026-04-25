import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faList, faSignOutAlt, faSearch, faBell, faChevronDown, faTimes, faCheck, faCircle, faRocket } from '@fortawesome/free-solid-svg-icons';
import { taskApi } from '../api/tasks';
import type { Task } from '../types';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; message: string; time: string; read: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('notifications');
      return saved ? JSON.parse(saved) : [
        { id: '1', message: '任务"A"已完成', time: '5分钟前', read: false },
        { id: '2', message: '任务"B"被阻塞', time: '1小时前', read: false },
      ];
    } catch {
      return [];
    }
  });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/kanban', label: '看板', icon: faThLarge },
    { path: '/list', label: '列表', icon: faList },
    { path: '/templates', label: '模板', icon: faRocket },
  ];

  // Search
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const tasks = await taskApi.getTasks();
        const q = searchQuery.toLowerCase();
        setSearchResults(
          tasks.filter(t =>
            t.title.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.tags?.some(tag => tag.toLowerCase().includes(q))
          ).slice(0, 8)
        );
      } catch {
        setSearchResults([]);
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  // Persist notifications to localStorage on change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-500';
      case 'IN_PROGRESS': return 'text-blue-500';
      default: return 'text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '已完成';
      case 'IN_PROGRESS': return '进行中';
      default: return '待办';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            {/* Left: Logo & Nav */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2 mr-6">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                  <FontAwesomeIcon icon={faThLarge} className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-slate-700 text-base">任务管理</span>
              </div>

              <div className="hidden sm:flex items-center h-14 space-x-0.5">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-1.5 h-10 rounded-lg text-sm font-medium transition-all duration-150 ${
                      location.pathname === item.path
                        ? 'bg-slate-100 text-slate-800'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Actions & User */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-150"
              >
                <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-150 relative"
                >
                  <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <h3 className="font-semibold text-slate-700">通知</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                          全部标为已读
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-sm">暂无通知</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-cyan-50/50' : ''}`}>
                            <FontAwesomeIcon
                              icon={faCircle}
                              className={`w-2 h-2 mt-2 flex-shrink-0 ${n.read ? 'text-slate-300' : 'text-cyan-500'}`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${n.read ? 'text-slate-500' : 'text-slate-700'}`}>{n.message}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative ml-2 pl-2 border-l border-slate-200" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-medium text-slate-700 text-sm">{user?.email?.split('@')[0]}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setShowUserMenu(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={(e) => { if (e.target === e.currentTarget) setShowSearch(false); }}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSearch(false)} />
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <FontAwesomeIcon icon={faSearch} className="w-5 h-5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索任务标题、描述或标签..."
                className="flex-1 text-slate-800 placeholder:text-slate-400 focus:outline-none text-base"
              />
              <button onClick={() => setShowSearch(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="max-h-80 overflow-y-auto py-2">
                {searchResults.map(task => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery('');
                      navigate('/kanban', { state: { openTaskId: task.id } });
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={`w-4 h-4 flex-shrink-0 ${task.status === 'COMPLETED' ? 'text-green-500' : task.status === 'IN_PROGRESS' ? 'text-blue-500' : 'text-slate-300'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs ${getStatusColor(task.status)}`}>{getStatusLabel(task.status)}</span>
                        {task.priority && (
                          <span className="text-xs text-slate-400">{task.priority}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <div className="py-10 text-center text-slate-400 text-sm">未找到相关任务</div>
            )}

            {!searchQuery && (
              <div className="py-6 text-center text-slate-400 text-sm">
                输入关键词搜索任务
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
