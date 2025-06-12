import { ServiceButton } from "../types";

export const SERVICE_BUTTONS: ServiceButton[] = [
  {
    id: "wifi",
    icon: "📶",
    labels: {
      pl: "WiFi",
      de: "WiFi",
      gb: "WiFi",
    },
    messages: {
      pl: "Potrzebuję informacji o WiFi. Czy możesz podać mi hasło i szczegóły połączenia?",
      de: "Ich benötige WiFi-Informationen. Können Sie mir das Passwort und die Verbindungsdetails geben?",
      gb: "I need WiFi information. Can you provide me with the password and connection details?",
    },
  },
  {
    id: "breakfast",
    icon: "🍳",
    labels: {
      pl: "Śniadanie",
      de: "Frühstück",
      gb: "Breakfast",
    },
    messages: {
      pl: "Chciałbym wiedzieć o śniadaniu. Jakie są godziny otwarcia i co jest dostępne?",
      de: "Ich möchte über das Frühstück wissen. Was sind die Öffnungszeiten und was ist verfügbar?",
      gb: "I would like to know about breakfast. What are the opening hours and what is available?",
    },
  },
  {
    id: "spa",
    icon: "🧘‍♀️",
    labels: {
      pl: "Spa",
      de: "Spa",
      gb: "Spa",
    },
    messages: {
      pl: "Interesuje mnie spa. Jakie są dostępne usługi, godziny otwarcia i jak mogę dokonać rezerwacji?",
      de: "Ich interessiere mich für das Spa. Welche Dienstleistungen sind verfügbar, was sind die Öffnungszeiten und wie kann ich eine Reservierung vornehmen?",
      gb: "I am interested in the spa. What services are available, what are the opening hours and how can I make a reservation?",
    },
  },
];
