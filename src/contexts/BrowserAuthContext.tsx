import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  register: () => false,
  logout: () => {},
  error: null,
});

export const BrowserAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState<string | null>(null);

  const register = (username: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
    
    if (users.some(u => u.email === email)) {
      setError('Email already exists');
      return false;
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      password,
    };

    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setError(null);
    return true;
  };

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setError(null);
      return true;
    }
    
    setError('Invalid email or password');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useBrowserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useBrowserAuth must be used within an AuthProvider');
  }
  return context;
};