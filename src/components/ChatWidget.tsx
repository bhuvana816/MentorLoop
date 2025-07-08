import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, Share2, X, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  text: string;
  isBot: boolean;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getBotResponse = (question: string): string => {
    const lower = question.toLowerCase();
    if (lower.includes('session')) return "We offer live mentorship and learning sessions on AI, web dev, and more. You can book sessions directly on our website.";
    if (lower.includes('quiz')) return "We have interactive AI quizzes to test and improve your knowledge. Check the 'AI Quiz' section on our website.";
    if (lower.includes('features') || lower.includes('what can you do')) return "This website offers live mentorship sessions, AI quizzes, and an interactive AI assistant to guide your learning journey.";
    if (lower.includes('how to book') || lower.includes('book a session')) return "To book a session, go to the 'Sessions' section, choose your topic and mentor, and pick a convenient slot.";
    if (lower.includes('price') || lower.includes('cost')) return "Most sessions are free, while premium mentorship sessions have a nominal fee listed in the session details.";
    if (lower.includes('thank')) return "You're welcome! Let me know if you need help with anything else.";
    if (lower.includes('bye')) return "Goodbye! Hope to see you soon for a session or quiz!";
    if (lower.includes('hi') || lower.includes('hello')) return "Hi there! How can I help you today?";
    if (lower.includes('contact')) return "Please check the Connect page on our website.";
    return "I can help you with information about sessions, AI quizzes, and using our website. Could you please clarify your question?";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = { text: getBotResponse(inputText), isBot: true };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { text: "Hi! How can I help you with sessions or quizzes today?", isBot: true }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMicClick = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);

      // Auto-send voice message
      setTimeout(() => {
        const userMessage = { text: transcript, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        setTimeout(() => {
          const botResponse = { text: getBotResponse(transcript), isBot: true };
          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
        }, 800);
      }, 400);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  const handleSpeak = () => {
    const lastBotMessage = [...messages].reverse().find(msg => msg.isBot);
    if (lastBotMessage) {
      const utterance = new SpeechSynthesisUtterance(lastBotMessage.text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
   <div className="fixed bottom-24 right-6 z-50">

      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col border border-gray-300"
        >
          {/* Header */}
          <div className="bg-white p-3 flex justify-between items-center border-b">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-[#4285f4]">ChatBot</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  {isTyping ? (
                    <>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" /> typing...
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full" /> online
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSpeak}><Volume2 className="w-5 h-5" /></button>
              <button onClick={handleMicClick}><Mic className="w-5 h-5" /></button>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                {msg.isBot && <Bot className="w-5 h-5 mr-2 text-gray-700" />}
                <div className={`max-w-[75%] p-2 rounded-2xl text-sm ${
                  msg.isBot ? 'bg-gray-200 text-gray-800' : 'bg-[#4285f4] text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-2 rounded-2xl text-sm flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200" />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-2 border-t bg-white">
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-full">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about sessions, quizzes, or the website..."
                className="flex-1 bg-transparent outline-none text-sm px-2"
              />
              <button type="submit" className={`p-1 ${inputText.trim() ? 'text-[#4285f4]' : 'text-gray-400'}`}>
                <Share2 className="w-5 h-5 rotate-90" />
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#4285f4] hover:bg-blue-600 text-white p-4 rounded-full shadow-xl transition"
        >
          <Bot className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
