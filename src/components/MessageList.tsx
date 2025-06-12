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
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Auto-scroll to bottom when new messages are added (only if user is at bottom)
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  // Check scroll position to show/hide scroll buttons
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrollable = scrollHeight > clientHeight;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
      
      setShowScrollButtons(isScrollable && messages.length > 3);
      setIsAtBottom(isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages]);

  const scrollToTop = () => {
    messagesTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-full overflow-y-auto relative" ref={scrollContainerRef}>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div ref={messagesTopRef} />
        
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

      {/* Scroll Buttons */}
      {showScrollButtons && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-10">
          <button
            onClick={scrollToTop}
            className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            title={selectedLanguage === 'pl' ? 'Przewiń do góry' : selectedLanguage === 'de' ? 'Nach oben scrollen' : 'Scroll to top'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          
          {!isAtBottom && (
            <button
              onClick={scrollToBottom}
              className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              title={selectedLanguage === 'pl' ? 'Przewiń do dołu' : selectedLanguage === 'de' ? 'Nach unten scrollen' : 'Scroll to bottom'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}