
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
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session retrieval error:', error);
        setUser(null);
        return;
      }
      
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
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setError(null);
      }
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata.username || session.user.email!,
        });
        setError(null);
      } else if (event !== 'SIGNED_OUT') {
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
      // First clear the local state to ensure UI updates immediately
      setUser(null);
      setError(null);
      
      // Then sign out from Supabase
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error('Logout error:', signOutError);
        toast({
          title: "Logout issue",
          description: "You've been logged out locally, but there was a server issue.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged out",
          description: "You have successfully logged out",
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast({
        title: "Logout issue",
        description: "There was an error during logout, but you've been logged out locally.",
        variant: "destructive",
      });
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
