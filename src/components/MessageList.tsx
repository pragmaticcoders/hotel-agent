import { useRef, useEffect, useState } from 'react';
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
  const messagesTopRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef(messages.length);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Auto-scroll when NEW messages are added
  useEffect(() => {
    if (messages.length > previousMessagesLength.current && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.isUser) {
        // User message - ALWAYS scroll to bottom to show message was sent
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (isAtBottom) {
        // Bot response - scroll to beginning of message ONLY if user was at bottom
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    previousMessagesLength.current = messages.length;
  }, [messages, isAtBottom]);

  // Check scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
      
      setIsAtBottom(isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages]);



  return (
    <div className="h-full overflow-y-auto relative" ref={scrollContainerRef}>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div ref={messagesTopRef} />
        
        {messages.length === 0 && (
          <WelcomeMessage 
            selectedLanguage={selectedLanguage}
            isLoading={isLoading}
            onServiceButtonClick={onServiceButtonClick}
          />
        )}
        
        {messages.map((message, index) => (
          <div 
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <MessageBubble
              message={message}
              index={index}
              messages={messages}
              selectedLanguage={selectedLanguage}
              isLoading={isLoading}
              onServiceButtonClick={onServiceButtonClick}
            />
          </div>
        ))}
        
        {isLoading && (
          <LoadingIndicator selectedLanguage={selectedLanguage} />
        )}
        
        <div ref={messagesEndRef} />
      </div>


    </div>
  );
}