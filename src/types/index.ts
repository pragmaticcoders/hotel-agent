export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface ServiceButton {
  id: string;
  icon: string;
  labels: {
    [key: string]: string; // language code -> label
  };
  messages: {
    [key: string]: string; // language code -> message
  };
}

export interface Translation {
  appTitle: string;
  appSubtitle: string;
  selectLanguage: string;
  welcomeTitle: string;
  welcomeDescription: string;
  offersTitle: string;
  offersText: string;
  offersText2: string;
  startTyping: string;
  placeholder: string;
  send: string;
  sending: string;
  typing: string;
  errorMessage: string;
  contactInfo: string;
}

export type LanguageCode = "pl" | "de" | "gb" | "cz" | "sk";
