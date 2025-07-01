import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'react-tabs/style/react-tabs.css'; // 添加到文件顶部
import { AuthProvider } from './context/auth-context';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

