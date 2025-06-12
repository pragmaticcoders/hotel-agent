'use client';

import { useState, useEffect, useRef } from 'react';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { useChat } from '../hooks/useChat';

export default function Chat() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sessionId,
    selectedLanguage,
    handleLanguageSelect,
    handleServiceButtonClick,
    sendMessage,
    handleKeyPress
  } = useChat();

  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll to collapse/expand header
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const currentScrollY = container.scrollTop;
      
      // Only collapse on mobile/tablet screens
      if (window.innerWidth >= 1024) {
        setIsHeaderCollapsed(false);
        return;
      }

      // Collapse when scrolling down, expand when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderCollapsed(true);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderCollapsed(false);
      }

      setLastScrollY(currentScrollY);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsHeaderCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 to-yellow-50 dark:bg-gray-900 flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <ChatHeader
          selectedLanguage={selectedLanguage}
          isLoading={isLoading}
          isCollapsed={isHeaderCollapsed}
          onLanguageSelect={handleLanguageSelect}
          onToggleCollapse={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
        />
      </div>
      
      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-hidden" ref={scrollContainerRef}>
        <MessageList
          messages={messages}
          selectedLanguage={selectedLanguage}
          isLoading={isLoading}
          onServiceButtonClick={handleServiceButtonClick}
        />
      </div>
      
      {/* Fixed Input and Footer */}
      <div className="flex-shrink-0">
        <ChatInput
          inputMessage={inputMessage}
          selectedLanguage={selectedLanguage}
          isLoading={isLoading}
          sessionId={sessionId}
          onInputChange={setInputMessage}
          onSendMessage={sendMessage}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}
