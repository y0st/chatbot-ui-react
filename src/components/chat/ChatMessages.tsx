import { useMemo } from 'react'
import { Message } from '@/types'
import { UserMessage } from './UserMessage'
import { AssistantMessage } from './AssistantMessage'
import { FunctionCallMessage } from './FunctionCallMessage'
import { SystemMessage } from './SystemMessage'
import { MarkdownViewer } from '@/components/MarkdownViewer'
import { CodeBlock } from '@/components/CodeBlock'
import { useChat } from '@/lib/hooks/useChat'

export const ChatMessages = ({ 
  messages,
  isLoading,
  onRegenerate
}: {
  messages: Message[]
  isLoading: boolean
  onRegenerate: () => void
}) => {
  const { settings } = useChat()
  
  const messageComponents = useMemo(() => {
    return messages.map((message, index) => {
      switch (message.role) {
        case 'user':
          return <UserMessage key={index} message={message} />
        case 'assistant':
          return (
            <AssistantMessage 
              key={index} 
              message={message} 
              isLast={index === messages.length - 1}
              onRegenerate={onRegenerate}
            />
          )
        case 'function_call':
          return <FunctionCallMessage key={index} message={message} />
        case 'system':
          return <SystemMessage key={index} message={message} />
        default:
          return null
      }
    })
  }, [messages, onRegenerate])
  
  return (
    <div className="space-y-6">
      {messageComponents}
      
      {/* 加载状态 */}
      {isLoading && (
        <AssistantMessage 
          message={{
            role: 'assistant',
            content: ''
          }}
          isLoading={true}
        />
      )}
    </div>
  )
}  