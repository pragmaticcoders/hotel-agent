'use client';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 dark:bg-gray-900 flex flex-col">
      <ChatHeader
        selectedLanguage={selectedLanguage}
        isLoading={isLoading}
        onLanguageSelect={handleLanguageSelect}
      />
      
      <MessageList
        messages={messages}
        selectedLanguage={selectedLanguage}
        isLoading={isLoading}
        onServiceButtonClick={handleServiceButtonClick}
      />
      
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
  );
}
