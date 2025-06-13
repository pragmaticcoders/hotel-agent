import { Translation, LanguageCode } from "../types";
import { pl } from "./pl";
import { de } from "./de";
import { gb } from "./gb";
import { cz } from "./cz";
import { sk } from "./sk";

export const translations: Record<LanguageCode, Translation> = {
  pl,
  de,
  gb,
  cz,
  sk,
};

export const encouragementMessages: Record<LanguageCode, string> = {
  pl: "Kliknij na dowolną ikonę powyżej, aby szybko zapytać o te usługi! 👆",
  de: "Klicken Sie auf ein Symbol oben, um schnell nach diesen Diensten zu fragen! 👆",
  gb: "Click on any icon above to quickly ask about these services! 👆",
  cz: "Klikněte na libovolnou ikonu výše a rychle se zeptejte na tyto služby! 👆",
  sk: "Kliknite na ľubovoľnú ikonu vyššie a rýchlo sa opýtajte na tieto služby! 👆",
};

// Helper function to get translated text
export const getTranslation = (
  selectedLanguage: string,
  key: keyof Translation
): string => {
  return (
    translations[selectedLanguage as LanguageCode]?.[key] ||
    translations.pl[key]
  );
};
