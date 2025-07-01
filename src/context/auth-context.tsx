import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const TOKEN_KEY = 'chatbot-auth-token';

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: { id: string; name: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// 仅保留命名导出
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // 使用 useCallback 的正确方式
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem(TOKEN_KEY, token);
      setIsAuthenticated(true);
      setUser({ id: '1', name: 'Test User' });
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        // 暂时只检查 token 是否存在
            setIsAuthenticated(true);
        setUser({ id: '1', name: 'Test User' });
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,  // 暴露加载状态
      login,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// 删除其他导出形式如：
// export default AuthProvider;