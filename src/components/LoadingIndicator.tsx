import { getTranslation } from '../translations';

interface LoadingIndicatorProps {
  selectedLanguage: string;
}

export default function LoadingIndicator({ selectedLanguage }: LoadingIndicatorProps) {
  const t = (key: keyof typeof import('../translations').translations.pl) => 
    getTranslation(selectedLanguage, key);

  return (
    <div className="flex justify-start">
      <div className="bg-white border border-amber-200 rounded-lg px-4 py-2 max-w-xs shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-amber-700">{t('typing')}</span>
        </div>
      </div>
    </div>
  );
} 