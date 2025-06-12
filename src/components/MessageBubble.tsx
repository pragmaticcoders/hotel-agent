import { Message } from '../types';
import ServiceButtons from './ServiceButtons';
import ReactMarkdown from 'react-markdown';

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

  // Sender labels based on language
  const senderLabels = {
    user: {
      pl: 'Gość',
      de: 'Gast', 
      gb: 'Guest'
    },
    bot: {
      pl: 'Hotel Smile Asystent',
      de: 'Hotel Smile Assistent',
      gb: 'Hotel Smile Assistant'
    }
  };

  const getSenderLabel = (isUser: boolean) => {
    const labels = isUser ? senderLabels.user : senderLabels.bot;
    return labels[selectedLanguage as keyof typeof labels] || labels.gb;
  };

  return (
    <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
      {/* Sender Label */}
      <div className={`mb-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          message.isUser 
            ? 'bg-amber-200 text-amber-800' 
            : 'bg-amber-100 text-amber-700'
        }`}>
          {message.isUser ? '👤' : '🏨'} {getSenderLabel(message.isUser)}
        </span>
      </div>
      
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.isUser
            ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md'
            : 'bg-white text-gray-900 border border-amber-200 shadow-sm'
        }`}
      >
        {message.isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        ) : (
          <div className="text-sm prose prose-sm max-w-none prose-amber">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-bold text-amber-900">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-amber-900">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-amber-900">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-amber-900">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-amber-300 pl-3 italic bg-amber-50 py-1 my-2">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-900 underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        )}
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