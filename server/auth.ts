import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

interface LoginBody {
  email?: string;
  password?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  return password && password.length >= 6;
}

// Mock JWT token generator
function generateMockJWT(email: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ email, iat: Date.now() })).toString('base64');
  const signature = 'mock_signature';
  return `${header}.${payload}.${signature}`;
}

// Login endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body as LoginBody;
  const errors: ValidationError[] = [];

  // Validate email
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Validate password
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (!validatePassword(password)) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  // Return 400 for validation errors
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  // Mock authentication (accept any valid email/password for demo)
  // In production, this would verify against a database
  const validCredentials: Record<string, string> = {
    'test@example.com': 'password123',
  };

  const storedPassword = validCredentials[email!];

  if (!storedPassword || storedPassword !== password) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  // Generate and return mock JWT token
  const token = generateMockJWT(email!);
  res.json({ token });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
