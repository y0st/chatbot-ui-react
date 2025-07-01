import { Button } from '../ui/Button';

interface ChatEmptyStateProps {
  onCreateChat: () => void;
}

export const ChatEmptyState = ({ onCreateChat }: ChatEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="w-16 h-16 mb-4 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        开始新的对话
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        点击下方按钮开始一个新的对话，您可以与 AI 助手进行交流。
      </p>
      
      <Button
        onClick={onCreateChat}
        variant="primary"
        size="lg"
      >
        新建对话
      </Button>
    </div>
  );
}; 