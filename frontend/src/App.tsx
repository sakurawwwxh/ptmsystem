import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import KanbanBoard from './components/KanbanBoard';
import TaskList from './components/TaskList';
import TemplateList from './components/TemplateList';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/kanban" element={
            <PrivateRoute><KanbanBoard /></PrivateRoute>
          } />
          <Route path="/list" element={
            <PrivateRoute><TaskList /></PrivateRoute>
          } />
          <Route path="/templates" element={
            <PrivateRoute><TemplateList /></PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/kanban" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return <LoginForm onSubmit={async (data) => { await login(data.email, data.password); navigate('/kanban'); }} />;
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  return <LoginForm onSubmit={async (data) => { await register(data.email, data.password); navigate('/kanban'); }} isRegister />;
}

export default App;