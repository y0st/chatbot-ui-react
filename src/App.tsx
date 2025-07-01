// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/chat-context';
import Sidebar from './components/sidebar/Sidebar';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/auth-context';
import './App.css';
import 'react-tabs/style/react-tabs.css';

// 受保护的路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated); // 添加日志
  
  // 如果未认证，重定向到登录页
  if (!isAuthenticated) {
    console.log('Redirecting to login page');
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

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