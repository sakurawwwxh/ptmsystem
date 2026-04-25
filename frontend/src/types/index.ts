export interface User {
  id: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  tags: string[];
  dueDate?: string;
  subtasks: Subtask[];
  completedSubtasks: number;
  totalSubtasks: number;
  repeatType?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  templateId?: string;
  nextRepeatDate?: string;
  repeatStartDate?: string;
  reminderTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskRequest {
  title: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority?: 'P0' | 'P1' | 'P2' | 'P3';
  tags?: string[];
  dueDate?: string;
  repeatType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null;
  reminderTime?: string;
  subtasks?: { title: string; completed: boolean }[];
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  title: string;
  description?: string;
  priority?: 'P0' | 'P1' | 'P2' | 'P3';
  tags?: string[];
  subtasks?: { title: string; completed: boolean }[];
  repeatType?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  reminderTime?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userEmail: string;
  content: string;
  createdAt: string;
}