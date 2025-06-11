'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface ServiceButton {
  id: string;
  icon: string;
  labels: {
    [key: string]: string; // language code -> label
  };
  messages: {
    [key: string]: string; // language code -> message
  };
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('pl');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = [
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'gb', name: 'British', flag: '🇬🇧' }
  ];

  const serviceButtons: ServiceButton[] = [
    {
      id: 'wifi',
      icon: '📶',
      labels: {
        pl: 'WiFi',
        de: 'WiFi',
        gb: 'WiFi'
      },
      messages: {
        pl: 'Potrzebuję informacji o WiFi. Czy możesz podać mi hasło i szczegóły połączenia?',
        de: 'Ich benötige WiFi-Informationen. Können Sie mir das Passwort und die Verbindungsdetails geben?',
        gb: 'I need WiFi information. Can you provide me with the password and connection details?'
      }
    },
    {
      id: 'breakfast',
      icon: '🍳',
      labels: {
        pl: 'Śniadanie',
        de: 'Frühstück',
        gb: 'Breakfast'
      },
      messages: {
        pl: 'Chciałbym wiedzieć o śniadaniu. Jakie są godziny otwarcia i co jest dostępne?',
        de: 'Ich möchte über das Frühstück wissen. Was sind die Öffnungszeiten und was ist verfügbar?',
        gb: 'I would like to know about breakfast. What are the opening hours and what is available?'
      }
    },
    {
      id: 'spa',
      icon: '🧘‍♀️',
      labels: {
        pl: 'Spa',
        de: 'Spa',
        gb: 'Spa'
      },
      messages: {
        pl: 'Interesuje mnie spa. Jakie są dostępne usługi, godziny otwarcia i jak mogę dokonać rezerwacji?',
        de: 'Ich interessiere mich für das Spa. Welche Dienstleistungen sind verfügbar, was sind die Öffnungszeiten und wie kann ich eine Reservierung vornehmen?',
        gb: 'I am interested in the spa. What services are available, what are the opening hours and how can I make a reservation?'
      }
    }
  ];

  const encouragementMessages = {
    pl: 'Kliknij na dowolną ikonę powyżej, aby szybko zapytać o te usługi! 👆',
    de: 'Klicken Sie auf ein Symbol oben, um schnell nach diesen Diensten zu fragen! 👆',
    gb: 'Click on any icon above to quickly ask about these services! 👆'
  };

  // Generate sessionId when component mounts
  useEffect(() => {
    const generateSessionId = () => {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };
    setSessionId(generateSessionId());
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLanguageSelect = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (!language) return;

    setSelectedLanguage(languageCode);
    
    // Send automatic message about language selection
    const selectionMessage: Message = {
      id: Date.now().toString(),
      text: `I've selected ${language.name} ${language.flag} as my preferred language.`,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, selectionMessage]);
    
    // Send to webhook
    sendLanguageSelection(language);
  };

  const sendLanguageSelection = async (language: Language) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://n8n.pragmaticcoders.com/webhook/03174380-d791-4b95-a178-4c8d5bec7916/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `User selected ${language.name} as their preferred language`,
          sessionId: sessionId,
          language: language.code,
          languageName: language.name,
          messageType: 'language_selection',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });

      if (response.ok) {
        const data = await response.json() as { output?: string };
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.output || 'Language preference noted!',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending language selection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceButtonClick = (serviceId: string) => {
    const service = serviceButtons.find(btn => btn.id === serviceId);
    if (!service) return;

    // Use selected language (defaults to Polish)
    const languageCode = selectedLanguage;
    const message = service.messages[languageCode] || service.messages['gb'];

    // Send the service inquiry message
    const serviceMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, serviceMessage]);
    
    // Send to webhook
    sendServiceInquiry(serviceId, message);
  };

  const sendServiceInquiry = async (serviceId: string, message: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://n8n.pragmaticcoders.com/webhook/03174380-d791-4b95-a178-4c8d5bec7916/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId,
          language: selectedLanguage,
          languageName: languages.find(lang => lang.code === selectedLanguage)?.name || 'Polish',
          serviceType: serviceId,
          messageType: 'service',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });

      if (response.ok) {
        const data = await response.json() as { output?: string };
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.output || 'I will help you with that!',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending service inquiry:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://n8n.pragmaticcoders.com/webhook/03174380-d791-4b95-a178-4c8d5bec7916/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          sessionId: sessionId,
          language: selectedLanguage,
          languageName: languages.find(lang => lang.code === selectedLanguage)?.name || 'Polish',
          messageType: 'chat',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });

      if (response.ok) {
        const data = await response.json() as { output?: string };
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.output || 'No response received',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Przepraszamy, wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 shadow-lg border-b border-green-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://hotelsmile.pl/resources/assets/images/logo.png" 
                alt="Hotel Smile Logo" 
                className="h-12 w-auto object-contain bg-white/90 rounded-lg p-1"
              />
              <div>
                <h1 className="text-xl font-bold text-white">
                  Hotel Smile ⭐⭐⭐
                </h1>
                <p className="text-sm text-green-100">Asystent Wirtualny • Szczawnica, Pieniny</p>
              </div>
            </div>
            <div className="text-xs text-green-100">
              Sesja: {sessionId.substring(0, 20)}...
            </div>
      </div>

          {/* Language Selection */}
          <div className="flex flex-col space-y-2 mb-4">
            <label className="text-sm font-medium text-white">
              Wybierz preferowany język:
            </label>
            <div className="flex space-x-2 flex-wrap">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                    selectedLanguage === language.code
                      ? 'bg-white text-green-600 border-white shadow-md transform scale-105 font-semibold'
                      : 'bg-green-500 text-white border-green-400 hover:bg-green-400'
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

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mx-4">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://hotelsmile.pl/resources/assets/images/logo.png" 
                      alt="Hotel Smile Logo" 
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mb-2">Witamy w Hotel Smile!</h2>
                  <p className="text-gray-600 mb-4">
                    Jesteśmy tutaj, aby pomóc Ci zaplanować idealny pobyt w Szczawnicy
                  </p>
                  <div className="text-sm text-green-700 bg-green-50 rounded-lg p-3">
                    <p className="font-semibold mb-1">🌟 Oferujemy:</p>
                    <p>• Pokoje z widokiem na Pieniny • SPA & Wellness • Restauracja</p>
                    <p>• Spływ Dunajcem • Górskie atrakcje • Sale konferencyjne</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Zacznij pisać wiadomość poniżej, aby rozpocząć rozmowę
                  </p>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => {
              // Find the index of the last bot message
              const lastBotMessageIndex = messages.map((msg, idx) => ({ ...msg, originalIndex: idx }))
                .filter(msg => !msg.isUser)
                .pop()?.originalIndex;
              
              const showServiceButtons = !message.isUser && index === lastBotMessageIndex;
              
              return (
              <div
                key={message.id}
                className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-900 border border-green-200 shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                
                {/* Service buttons after bot messages */}
                {showServiceButtons && (
                  <div className="mt-2 max-w-xs lg:max-w-md">
                    <div className="flex space-x-2">
                      {serviceButtons.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => handleServiceButtonClick(service.id)}
                          className="flex flex-row gap-2 items-center px-2 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoading}
                                                  title={`Ask about ${service.labels[selectedLanguage] || service.labels.pl}`}
                      >
                        <span className="text-lg">{service.icon}</span>
                        <span className="text-xs font-medium text-green-700 mt-1">
                          {service.labels[selectedLanguage] || service.labels.pl}
                        </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-green-600 mt-2 text-center italic font-medium">
                      {encouragementMessages[selectedLanguage as keyof typeof encouragementMessages] || encouragementMessages.pl}
                    </p>
                  </div>
                )}
              </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-green-200 rounded-lg px-4 py-2 max-w-xs shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-green-600">Hotel Smile pisze...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-green-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Napisz swoją wiadomość o hotelu..."
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-700 bg-white"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading || !sessionId}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
            >
              {isLoading ? 'Wysyłanie...' : 'Wyślij'}
            </button>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs text-green-600">
              📞 <strong>606 665 662</strong> • 📍 <strong>ul. Główna 234, Szczawnica</strong> • 🌐 <strong>hotelsmile.pl</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
