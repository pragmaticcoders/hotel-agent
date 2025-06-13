import { Language } from '../types';
import { getTranslation } from '../translations';
import { LANGUAGES } from '../constants/languages';

interface ChatHeaderProps {
  selectedLanguage: string;
  isLoading: boolean;
  isCollapsed: boolean;
  onLanguageSelect: (languageCode: string) => void;
  onToggleCollapse: () => void;
}

export default function ChatHeader({ 
  selectedLanguage, 
  isLoading, 
  isCollapsed, 
  onLanguageSelect, 
  onToggleCollapse 
}: ChatHeaderProps) {
  const t = (key: keyof typeof import('../translations').translations.pl) => 
    getTranslation(selectedLanguage, key);

  return (
    <div 
      className={`bg-cover bg-center bg-no-repeat shadow-lg border-b border-amber-200 relative transition-all duration-300 ease-in-out ${
        isCollapsed ? 'p-2' : 'p-4'
      }`} 
      style={{ backgroundImage: 'url(https://hotelsmile.pl/resources/assets/images/bg-relax.jpg)' }}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Collapsed Header - Only Logo and Toggle */}
        {isCollapsed && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src="https://hotelsmile.pl/resources/assets/images/logo.png" 
                alt="Hotel Smile Logo" 
                className="h-8 w-auto object-contain bg-white/90 rounded-lg p-1"
              />
              <h1 className="text-sm font-bold text-white">
                {t('appTitle')}
              </h1>
            </div>
                          <button
                onClick={onToggleCollapse}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                title={selectedLanguage === 'pl' ? 'Rozwiń header' : selectedLanguage === 'de' ? 'Header erweitern' : selectedLanguage === 'cz' ? 'Rozbalit záhlaví' : selectedLanguage === 'sk' ? 'Rozbaliť hlavičku' : 'Expand header'}
              >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Expanded Header - Full Content */}
        {!isCollapsed && (
          <>
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
              {/* Collapse button - only visible on mobile */}
              <button
                onClick={onToggleCollapse}
                className="lg:hidden bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                title={selectedLanguage === 'pl' ? 'Zwiń header' : selectedLanguage === 'de' ? 'Header zusammenklappen' : selectedLanguage === 'cz' ? 'Sbalit záhlaví' : selectedLanguage === 'sk' ? 'Zbaliť hlavičku' : 'Collapse header'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
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
                    {selectedLanguage === 'cz' && 'Odpočiňte si v našem SPA & Wellness!'}
                    {selectedLanguage === 'sk' && 'Oddýchnite si v našom SPA & Wellness!'}
                  </p>
                  <p className="text-xs text-amber-700">
                    {selectedLanguage === 'pl' && 'Masaże, sauna, jacuzzi - zapytaj o dostępność'}
                    {selectedLanguage === 'de' && 'Massagen, Sauna, Jacuzzi - fragen Sie nach Verfügbarkeit'}
                    {selectedLanguage === 'gb' && 'Massages, sauna, jacuzzi - ask about availability'}
                    {selectedLanguage === 'cz' && 'Masáže, sauna, jacuzzi - zeptejte se na dostupnost'}
                    {selectedLanguage === 'sk' && 'Masáže, sauna, jacuzzi - opýtajte sa na dostupnosť'}
                  </p>
                </div>
                <button 
                  className="px-3 py-1 bg-amber-600 text-white text-xs rounded-full hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-600"
                  disabled={isLoading}
                  onClick={() => {
                    // This will be handled by the parent component
                    const spaMessage = selectedLanguage === 'pl' 
                      ? 'Interesuje mnie spa. Jakie są dostępne usługi, godziny otwarcia i jak mogę dokonać rezerwacji?'
                      : selectedLanguage === 'de'
                      ? 'Ich interessiere mich für das Spa. Welche Dienstleistungen sind verfügbar, was sind die Öffnungszeiten und wie kann ich eine Reservierung vornehmen?'
                      : selectedLanguage === 'cz'
                      ? 'Zajímá mě spa. Jaké služby jsou k dispozici, jaké jsou otevírací hodiny a jak si mohu udělat rezervaci?'
                      : selectedLanguage === 'sk'
                      ? 'Zaujíma ma spa. Aké služby sú k dispozícii, aké sú otváracie hodiny a ako si môžem urobiť rezerváciu?'
                      : 'I am interested in the spa. What services are available, what are the opening hours and how can I make a reservation?';
                    
                    // We need to pass this up to the parent
                    window.dispatchEvent(new CustomEvent('spa-inquiry', { detail: spaMessage }));
                  }}
                >
                  {selectedLanguage === 'pl' && 'Zapytaj'}
                  {selectedLanguage === 'de' && 'Fragen'}
                  {selectedLanguage === 'gb' && 'Ask'}
                  {selectedLanguage === 'cz' && 'Zeptat se'}
                  {selectedLanguage === 'sk' && 'Opýtať sa'}
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
          </>
        )}
      </div>
    </div>
  );
} 