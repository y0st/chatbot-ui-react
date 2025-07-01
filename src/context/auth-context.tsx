import { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: { id: string; name: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  // 模拟登录函数（快速测试用）
  const login = useCallback(async (email: string, password: string) => {
    // 验证邮箱和密码（测试用）
    if (email === 'test@example.com' && password === 'Test@123') {
      setIsAuthenticated(true);
      setUser({ id: '1', name: 'Test User' });
      
      // 保存认证状态到localStorage，刷新页面后保持登录
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Test User' }));
      
      return true;
    } else {
      throw new Error('Invalid credentials. Use test@example.com / Test@123');
    }
  }, []);

  // 登出函数
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};