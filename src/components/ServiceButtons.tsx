import { SERVICE_BUTTONS } from '../constants/serviceButtons';
import { encouragementMessages } from '../translations';
import { LanguageCode } from '../types';

interface ServiceButtonsProps {
  selectedLanguage: string;
  isLoading: boolean;
  onServiceButtonClick: (serviceId: string) => void;
}

export default function ServiceButtons({ selectedLanguage, isLoading, onServiceButtonClick }: ServiceButtonsProps) {
  return (
    <div className="mt-2 max-w-xs lg:max-w-md">
      <div className="flex space-x-2">
        {SERVICE_BUTTONS.map((service) => (
          <button
            key={service.id}
            onClick={() => onServiceButtonClick(service.id)}
            className="flex flex-row gap-2 items-center px-2 py-2 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            title={`Ask about ${service.labels[selectedLanguage] || service.labels.pl}`}
          >
            <span className="text-lg">{service.icon}</span>
            <span className="text-xs font-medium text-amber-800 mt-1">
              {service.labels[selectedLanguage] || service.labels.pl}
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-amber-700 mt-2 text-center italic font-medium">
        {encouragementMessages[selectedLanguage as LanguageCode] || encouragementMessages.pl}
      </p>
    </div>
  );
} 