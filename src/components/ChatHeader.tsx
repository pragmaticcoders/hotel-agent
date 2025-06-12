import { Language } from '../types';
import { getTranslation } from '../translations';
import { LANGUAGES } from '../constants/languages';

interface ChatHeaderProps {
  selectedLanguage: string;
  isLoading: boolean;
  onLanguageSelect: (languageCode: string) => void;
}

export default function ChatHeader({ selectedLanguage, isLoading, onLanguageSelect }: ChatHeaderProps) {
  const t = (key: keyof typeof import('../translations').translations.pl) => 
    getTranslation(selectedLanguage, key);

  return (
    <div className="bg-cover bg-center bg-no-repeat shadow-lg border-b border-amber-200 p-4 relative" style={{ backgroundImage: 'url(https://hotelsmile.pl/resources/assets/images/bg-relax.jpg)' }}>
              <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src="https://hotelsmile.pl/resources/assets/images/logo.png" 
              alt="Hotel Smile Logo" 
              className="h-12 w-auto object-contain bg-white/90 rounded-lg p-1"
            />
            <div>
              <h1 className="text-xl font-bold text-white">
                {t('appTitle')}
              </h1>
              <p className="text-sm text-white">{t('appSubtitle')}</p>
            </div>
          </div>
        </div>

        {/* SPA Promotion */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🧘‍♀️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                {selectedLanguage === 'pl' && 'Zrelaksuj się w naszym SPA & Wellness!'}
                {selectedLanguage === 'de' && 'Entspannen Sie sich in unserem SPA & Wellness!'}
                {selectedLanguage === 'gb' && 'Relax in our SPA & Wellness center!'}
              </p>
              <p className="text-xs text-amber-700">
                {selectedLanguage === 'pl' && 'Masaże, sauna, jacuzzi - zapytaj o dostępność'}
                {selectedLanguage === 'de' && 'Massagen, Sauna, Jacuzzi - fragen Sie nach Verfügbarkeit'}
                {selectedLanguage === 'gb' && 'Massages, sauna, jacuzzi - ask about availability'}
              </p>
            </div>
            <button 
              className="px-3 py-1 bg-amber-600 text-white text-xs rounded-full hover:bg-amber-700 transition-colors"
              onClick={() => {
                // This will be handled by the parent component
                const spaMessage = selectedLanguage === 'pl' 
                  ? 'Interesuje mnie spa. Jakie są dostępne usługi, godziny otwarcia i jak mogę dokonać rezerwacji?'
                  : selectedLanguage === 'de'
                  ? 'Ich interessiere mich für das Spa. Welche Dienstleistungen sind verfügbar, was sind die Öffnungszeiten und wie kann ich eine Reservierung vornehmen?'
                  : 'I am interested in the spa. What services are available, what are the opening hours and how can I make a reservation?';
                
                // We need to pass this up to the parent
                window.dispatchEvent(new CustomEvent('spa-inquiry', { detail: spaMessage }));
              }}
            >
              {selectedLanguage === 'pl' && 'Zapytaj'}
              {selectedLanguage === 'de' && 'Fragen'}
              {selectedLanguage === 'gb' && 'Ask'}
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="flex flex-col space-y-2 mb-4">
          <label className="text-sm font-medium text-white">
            {t('selectLanguage')}
          </label>
          <div className="flex space-x-2 flex-wrap">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => onLanguageSelect(language.code)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                  selectedLanguage === language.code
                    ? 'bg-amber-800 text-white border-amber-700 shadow-md transform scale-105 font-semibold'
                    : 'bg-white text-amber-800 border-white hover:bg-amber-50'
                }`}
                disabled={isLoading}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
                {selectedLanguage === language.code && (
                  <span className="text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 