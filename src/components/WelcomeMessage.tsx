import { getTranslation } from '../translations';
import ServiceButtons from './ServiceButtons';

interface WelcomeMessageProps {
  selectedLanguage: string;
  isLoading: boolean;
  onServiceButtonClick: (serviceId: string) => void;
}

export default function WelcomeMessage({ selectedLanguage, isLoading, onServiceButtonClick }: WelcomeMessageProps) {
  const t = (key: keyof typeof import('../translations').translations.pl) => 
    getTranslation(selectedLanguage, key);

  return (
    <div className="text-center py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mx-4">
        <div className="flex justify-center mb-4">
          <img 
            src="https://hotelsmile.pl/resources/assets/images/logo.png" 
            alt="Hotel Smile Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-amber-700 mb-2">{t('welcomeTitle')}</h2>
        <p className="text-gray-600 mb-4">
          {t('welcomeDescription')}
        </p>
        <div className="text-sm text-amber-800 bg-amber-50 rounded-lg p-3">
          <p className="font-semibold mb-1">{t('offersTitle')}</p>
          <p>{t('offersText')}</p>
          <p>{t('offersText2')}</p>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          {t('startTyping')}
        </p>
        
        {/* Service Buttons */}
        <div className="mt-4 flex justify-center">
          <ServiceButtons
            selectedLanguage={selectedLanguage}
            isLoading={isLoading}
            onServiceButtonClick={onServiceButtonClick}
          />
        </div>
      </div>
    </div>
  );
} 