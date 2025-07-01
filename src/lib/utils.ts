import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  
  // 如果是今天
  if (diff < 24 * 60 * 60 * 1000) {
    return dateObj.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // 如果是昨天
  if (diff < 48 * 60 * 60 * 1000 && dateObj.getDate() === now.getDate() - 1) {
    return '昨天';
  }
  
  // 否则返回日期
  return dateObj.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
} 