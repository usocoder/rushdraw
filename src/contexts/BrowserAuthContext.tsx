import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthError } from '@supabase/supabase-js';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const BrowserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata.username || session.user.email!,
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata.username || session.user.email!,
        });
        setError(null);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const register = async (username: string, email: string, password: string) => {
    try {
      setError(null);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) {
        console.error("Registration error:", signUpError);
        setError(signUpError.message);
        return false;
      }

      if (data.user) {
        toast({
          title: "Registration successful",
          description: "You can now log in with your credentials",
        });
        return true;
      }

      return false;
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred during registration');
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        if (signInError.message === "Invalid login credentials") {
          setError("Invalid email or password");
        } else {
          setError(signInError.message);
        }
        return false;
      }

      if (data.user) {
        setError(null);
        return true;
      }

      return false;
    } catch (err) {
      const authError = err as AuthError;
      console.error('Login error:', authError);
      setError(authError.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        // If the error is due to session not found, we still want to clear the local state
        if (signOutError.message.includes('session_not_found')) {
          setUser(null);
          setError(null);
          return;
        }
        setError(signOutError.message);
      } else {
        setError(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Logout error:', err);
      // Even if there's an error, clear the local state
      setUser(null);
      setError('An unexpected error occurred during logout');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
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