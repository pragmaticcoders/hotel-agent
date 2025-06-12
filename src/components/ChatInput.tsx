import { getTranslation } from '../translations';

interface ChatInputProps {
  inputMessage: string;
  selectedLanguage: string;
  isLoading: boolean;
  sessionId: string;
  onInputChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function ChatInput({
  inputMessage,
  selectedLanguage,
  isLoading,
  sessionId,
  onInputChange,
  onSendMessage,
  onKeyPress
}: ChatInputProps) {
  const t = (key: keyof typeof import('../translations').translations.pl) => 
    getTranslation(selectedLanguage, key);

  return (
    <div className="bg-amber-800 border-t border-amber-700 p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder={t('placeholder')}
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none text-gray-700 bg-white text-sm md:text-base"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={onSendMessage}
            disabled={!inputMessage.trim() || isLoading || !sessionId}
            className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 font-semibold rounded-lg hover:from-amber-300 hover:to-yellow-300 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
          >
            {isLoading ? t('sending') : t('send')}
          </button>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-amber-100">
            📞 606 665 662 • 📍 ul. Główna 234, Szczawnica • 🌐{' '}
            <a 
              href="https://hotelsmile.pl/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-200 hover:text-white underline transition-colors"
            >
              hotelsmile.pl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 