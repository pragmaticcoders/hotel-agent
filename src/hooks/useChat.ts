import { useState, useEffect } from "react";
import { Message, Language } from "../types";
import { SERVICE_BUTTONS } from "../constants/serviceButtons";
import { LANGUAGES } from "../constants/languages";
import { getTranslation } from "../translations";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("pl");

  // Generate sessionId when component mounts
  useEffect(() => {
    const generateSessionId = () => {
      return (
        "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
      );
    };
    setSessionId(generateSessionId());
  }, []);

  // Handle SPA inquiry from header
  useEffect(() => {
    const handleSpaInquiry = (event: CustomEvent) => {
      const message = event.detail;
      const serviceMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, serviceMessage]);
      sendServiceInquiry("spa", message);
    };

    window.addEventListener("spa-inquiry", handleSpaInquiry as EventListener);

    return () => {
      window.removeEventListener(
        "spa-inquiry",
        handleSpaInquiry as EventListener
      );
    };
  }, [selectedLanguage, sessionId]);

  const handleLanguageSelect = (languageCode: string) => {
    const language = LANGUAGES.find((lang) => lang.code === languageCode);
    if (!language) return;

    // Don't do anything if the language is already selected
    if (selectedLanguage === languageCode) return;

    setSelectedLanguage(languageCode);

    // Send automatic message about language selection
    const languageMessages = {
      pl: `Wybrałem język Polski ${language.flag} jako preferowany język.`,
      de: `Ich habe ${language.name} ${language.flag} als bevorzugte Sprache gewählt.`,
      gb: `I've selected ${language.name} ${language.flag} as my preferred language.`,
    };

    const selectionMessage: Message = {
      id: Date.now().toString(),
      text:
        languageMessages[languageCode as keyof typeof languageMessages] ||
        languageMessages.gb,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, selectionMessage]);

    // Send to webhook
    sendLanguageSelection(language);
  };

  const sendLanguageSelection = async (language: Language) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://n8n.pragmaticcoders.com/webhook/03174380-d791-4b95-a178-4c8d5bec7916/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `User selected ${language.name} as their preferred language`,
            sessionId: sessionId,
            language: language.code,
            languageName: language.name,
            messageType: "language_selection",
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        }
      );

      if (response.ok) {
        const data = (await response.json()) as { output?: string };
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.output || "Language preference noted!",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending language selection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceButtonClick = (serviceId: string) => {
    const service = SERVICE_BUTTONS.find((btn) => btn.id === serviceId);
    if (!service) return;

    // Use selected language (defaults to Polish)
    const languageCode = selectedLanguage;
    const message = service.messages[languageCode] || service.messages["gb"];

    // Send the service inquiry message
    const serviceMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, serviceMessage]);

    // Send to webhook
    sendServiceInquiry(serviceId, message);
  };

  const sendServiceInquiry = async (serviceId: string, message: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://n8n.pragmaticcoders.com/webhook/03174380-d791-4b95-a178-4c8d5bec7916/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            sessionId: sessionId,
            language: selectedLanguage,
            languageName:
              LANGUAGES.find((lang) => lang.code === selectedLanguage)?.name ||
              "Polish",
            serviceType: serviceId,
            messageType: "service",
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        }
      );

      if (response.ok) {
        const data = (await response.json()) as { output?: string };
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.output || "I will help you with that!",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending service inquiry:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://n8n.pragmaticcoders.com/webhook/03174380-d791-4b95-a178-4c8d5bec7916/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputMessage,
            sessionId: sessionId,
            language: selectedLanguage,
            languageName:
              LANGUAGES.find((lang) => lang.code === selectedLanguage)?.name ||
              "Polish",
            messageType: "chat",
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        }
      );

      if (response.ok) {
        const data = (await response.json()) as { output?: string };
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.output || "No response received",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getTranslation(selectedLanguage, "errorMessage"),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sessionId,
    selectedLanguage,
    handleLanguageSelect,
    handleServiceButtonClick,
    sendMessage,
    handleKeyPress,
  };
};
