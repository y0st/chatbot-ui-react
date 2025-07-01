// src/App.tsx

import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/chat-context';
import Sidebar from './components/sidebar/Sidebar';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import { useAuth, AuthProvider, AuthContextValue } from './context/auth-context';
// 添加 RegisterPage 组件的导入
import RegisterPage from './pages/RegisterPage'; 
import './App.css';
import 'react-tabs/style/react-tabs.css';

// 受保护的路由组件
interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;  // 显示加载状态
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 在根组件中包裹
function App() {
  return (
    <AuthProvider>
      <Router>
        <ChatProvider>
          <div className="min-h-screen bg-gray-900 text-white">
            <Routes>
              {/* 统一路径为 /chat */}
              <Route 
                path="/:workspaceId/chat" 
                element={<ProtectedRoute><ChatPage /></ProtectedRoute>} 
              />
              <Route path="/login" element={<LoginPage />} />
              {/* 添加注册页面路由 */}
              <Route path="/register" element={<RegisterPage />} />
              {/* 只重定向真正不存在的路径 */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </ChatProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
// <mcfile name="App.tsx" path="/Users/y/Project/chatbot-ui-react/src/App.tsx"></mcfile>