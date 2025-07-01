import { useEffect, useRef } from 'react'
import { Message } from '@/types'
import { UserMessage } from './UserMessage'
import { AssistantMessage } from './AssistantMessage'
import { FunctionCallMessage } from './FunctionCallMessage'
import { SystemMessage } from './SystemMessage'
import { MarkdownViewer } from '@/components/MarkdownViewer'
import { CodeBlock } from '@/components/CodeBlock'
import { useChat } from '@/lib/hooks/useChat'
import { Loader } from '../ui/Loader'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export const ChatMessages = ({ messages, isLoading, error }: ChatMessagesProps) => {
  const { settings } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 当消息更新时滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        switch (message.role) {
          case 'user':
            return <UserMessage key={message.id} message={message} />
          case 'assistant':
            return (
              <AssistantMessage 
                key={message.id} 
                message={{
                  ...message,
                  content: <MarkdownViewer>{message.content}</MarkdownViewer>
                }} 
                isLast={message.id === messages[messages.length - 1]?.id}
              />
            )
          case 'function_call':
            return <FunctionCallMessage key={message.id} message={message} />
          case 'system':
            return <SystemMessage key={message.id} message={message} />
          default:
            return null
        }
      })}
      
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader size="sm" />
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  )
}