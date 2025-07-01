import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ChatSettingsProps {
  onClose?: () => void;
}

export const ChatSettings = ({ onClose }: ChatSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-4"
      >
        设置
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                聊天设置
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                关闭
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API 密钥
                </label>
                <Input
                  type="password"
                  placeholder="输入您的 API 密钥"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  模型选择
                </label>
                <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  温度
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  defaultValue="1"
                  className="w-full"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={handleClose}
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                  onClick={handleClose}
                >
                  保存
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 