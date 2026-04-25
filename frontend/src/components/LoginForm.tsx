import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner, faExclamationCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>;
  isRegister?: boolean;
}

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({ onSubmit, isRegister = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = '请输入邮箱地址';
    } else if (!emailRegex.test(email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!password) {
      newErrors.password = '请输入密码';
    } else if (password.length < 6) {
      newErrors.password = '密码长度至少6位';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit({ email, password });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Submitted:', { email, password, isRegister });
      }
    } catch (error: any) {
      setErrors({ general: error?.response?.data?.message || error.message || '操作失败，请重试' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Google-Style Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-teal-50 via-white to-cyan-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-50 via-white to-teal-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="relative w-full max-w-md px-6">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          {/* Google-style "G" logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 rounded-3xl shadow-lg shadow-cyan-500/20 transform rotate-6" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-cyan-400 to-teal-400 rounded-3xl shadow-lg shadow-cyan-500/20 transform -rotate-3" />
            <div className="relative w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
              <div className="flex items-center gap-0.5">
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">T</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-medium text-slate-800 mb-2">
            任务管理
          </h1>
          <p className="text-slate-500 text-sm">
            {isRegister ? '创建账号，开始高效工作' : '欢迎回来，请登录继续'}
          </p>
        </div>

        {/* Form Card - Clean Google Style */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 relative">
          <h2 className="text-xl font-medium text-slate-800 mb-8 text-left">
            {isRegister ? '注册账号' : '登录账号'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
                <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 flex-shrink-0" />
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 ml-0.5">
                邮箱
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="you@gmail.com"
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400 text-slate-800 ${
                    errors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-200 hover:border-slate-300 focus:bg-white'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs ml-0.5 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 ml-0.5">
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400 text-slate-800 ${
                    errors.password ? 'border-red-400 bg-red-50/50' : 'border-slate-200 hover:border-slate-300 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed transition-colors duration-200 p-1"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-5 h-5" />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs ml-0.5 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer group">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500/30 disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                  记住我
                </span>
              </label>
            </div>

            {/* Submit Button - Google Blue */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
                  <span>{isRegister ? '注册中...' : '登录中...'}</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? '注册' : '登录'}</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Toggle Login/Register */}
            <div className="text-center text-sm pt-3">
              {isRegister ? (
                <span className="text-slate-400">已有账号？</span>
              ) : (
                <span className="text-slate-400">还没有账号？</span>
              )}
              <a
                href={isRegister ? '/login' : '/register'}
                className="ml-1 text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = isRegister ? '/login' : '/register';
                }}
              >
                {isRegister ? '登录' : '注册'}
              </a>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-8">
          登录即表示同意服务条款和隐私政策
        </p>
      </div>
    </div>
  );
}
