import { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import WelcomeMessage from './WelcomeMessage';
import LoadingIndicator from './LoadingIndicator';

interface MessageListProps {
  messages: Message[];
  selectedLanguage: string;
  isLoading: boolean;
  onServiceButtonClick: (serviceId: string) => void;
}

export default function MessageList({ 
  messages, 
  selectedLanguage, 
  isLoading, 
  onServiceButtonClick 
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <WelcomeMessage selectedLanguage={selectedLanguage} />
          )}
          
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              index={index}
              messages={messages}
              selectedLanguage={selectedLanguage}
              isLoading={isLoading}
              onServiceButtonClick={onServiceButtonClick}
            />
          ))}
          
          {isLoading && (
            <LoadingIndicator selectedLanguage={selectedLanguage} />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
} 