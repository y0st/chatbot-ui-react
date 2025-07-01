import React, { useState } from 'react';
// 修改导入路径，从 auth-context 中导入 useAuth
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 新增状态用于存储错误信息
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setErrorMessage(''); // 清空错误信息
      await axios.post('http://localhost:3001/api/auth/register', { email, password });
      await login(email, password);
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrorMessage('该邮箱已被注册，请使用其他邮箱。');
      } else {
        console.error('注册失败:', error);
        setErrorMessage('注册失败，请稍后重试。');
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-8 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">注册</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} {/* 显示错误信息 */}
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleRegister}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;