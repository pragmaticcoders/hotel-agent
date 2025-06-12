import { Message } from '../types';
import ServiceButtons from './ServiceButtons';

interface MessageBubbleProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedLanguage: string;
  isLoading: boolean;
  onServiceButtonClick: (serviceId: string) => void;
}

export default function MessageBubble({ 
  message, 
  index, 
  messages, 
  selectedLanguage, 
  isLoading, 
  onServiceButtonClick 
}: MessageBubbleProps) {
  // Find the index of the last bot message
  const lastBotMessageIndex = messages.map((msg, idx) => ({ ...msg, originalIndex: idx }))
    .filter(msg => !msg.isUser)
    .pop()?.originalIndex;
  
  const showServiceButtons = !message.isUser && index === lastBotMessageIndex;

  return (
    <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.isUser
            ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md'
            : 'bg-white text-gray-900 border border-amber-200 shadow-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className={`text-xs mt-1 ${
          message.isUser ? 'text-amber-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
      
      {/* Service buttons after bot messages */}
      {showServiceButtons && (
        <ServiceButtons
          selectedLanguage={selectedLanguage}
          isLoading={isLoading}
          onServiceButtonClick={onServiceButtonClick}
        />
      )}
    </div>
  );
} 