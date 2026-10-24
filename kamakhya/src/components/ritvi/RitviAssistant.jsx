import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, X, Settings, Key, User, RefreshCw } from 'lucide-react';
import RitviAvatar from './RitviAvatar';

// Create React App ke liye:
const DEFAULT_GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || '';export default function RitviAssistant({ isOpen, onClose }) {
  const [userName, setUserName] = useState(() => localStorage.getItem('kamakhya_user_name') || '');
  
  const [apiKey, setApiKey] = useState(() => {
    const saved = localStorage.getItem('kamakhya_groq_api_key');
    if (!saved || saved.startsWith('sk-or-') || saved.startsWith('AQ.')) {
      return DEFAULT_GROQ_KEY;
    }
    return saved;
  });

  // App navbar language detect karna
  const detectAppLanguage = () => {
    const saved =
      localStorage.getItem('kamakhya_language') ||
      localStorage.getItem('language') ||
      localStorage.getItem('i18nextLng') ||
      localStorage.getItem('lang') ||
      '';

    if (saved.toLowerCase().startsWith('hi')) return 'hi';
    if (document.documentElement.lang?.toLowerCase().startsWith('hi')) return 'hi';

    const hasHindiInNavbar =
      document.querySelector('header')?.innerText?.includes('होम') ||
      document.body?.innerText?.includes('सीखें') ||
      document.body?.innerText?.includes('चक्र');

    return hasHindiInNavbar ? 'hi' : 'en';
  };

  const [currentLang, setCurrentLang] = useState(detectAppLanguage);
  const [showSettings, setShowSettings] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempKey, setTempKey] = useState(apiKey);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState(() => {
    const savedName = localStorage.getItem('kamakhya_user_name');
    const isHi = detectAppLanguage() === 'hi';

    if (savedName) {
      return [
        {
          sender: 'ritvi',
          text: isHi
            ? `नमस्ते ${savedName}! ❤️ मैं आपकी पर्सनल सहेली 'ऋत्वि' हूँ। आपका सारा डेटा पूरी तरह प्राइवेट है। आज मैं आपकी क्या मदद कर सकती हूँ?`
            : `Hello ${savedName}! ❤️ I am Ritvi, your personal wellness companion. Your data is 100% private. How can I help you today?`
        }
      ];
    }
    return [
      {
        sender: 'ritvi',
        text: isHi
          ? 'नमस्ते! ❤️ मैं आपकी प्राइवेसी-फर्स्ट हेल्थ साथी "ऋत्वि" हूँ। मैं आपको किस नाम से बुलाऊँ? कृपया नीचे अपना नाम लिखकर भेजें।'
          : 'Hello! ❤️ I am Ritvi, your privacy-first health companion. What should I call you? Please type your name below.'
      }
    ];
  });

  const chatEndRef = useRef(null);

  // Sync language with navbar state automatically
  useEffect(() => {
    const syncLang = () => {
      const activeLang = detectAppLanguage();
      setCurrentLang(prev => {
        if (prev !== activeLang) {
          setMessages(oldMsgs => {
            if (oldMsgs.length <= 1) {
              return [
                {
                  sender: 'ritvi',
                  text: activeLang === 'hi'
                    ? `नमस्ते ${userName || ''}! ❤️ मैं आपकी पर्सनल सहेली 'ऋत्वि' हूँ। आपका सारा डेटा पूरी तरह प्राइवेट है। आज मैं आपकी क्या मदद कर सकती हूँ?`
                    : `Hello ${userName || ''}! ❤️ I am Ritvi, your personal wellness companion. Your data is 100% private. How can I help you today?`
                }
              ];
            }
            return oldMsgs;
          });
          return activeLang;
        }
        return prev;
      });
    };

    syncLang();
    const interval = setInterval(syncLang, 400);
    return () => clearInterval(interval);
  }, [userName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Offline backup answer
  const getOfflineAnswer = (query, name, isHindi) => {
    const q = query.toLowerCase();

    if (isHindi) {
      const prefix = name ? `${name}, ` : '';
      if (q.includes('cramp') || q.includes('pain') || q.includes('dard') || q.includes('दर्द')) {
        return `${prefix}पीरियड क्रैम्प्स में पेट पर हीटिंग पैड रखना और गुनगुना पानी या अदरक वाली चाय पीना बहुत आराम देता है।`;
      }
      if (q.includes('pad') || q.includes('tampon') || q.includes('पैड')) {
        return `${prefix}पैड्स और टैम्पोन दोनों अच्छे और सुरक्षित हैं। शुरुआत के लिए पैड्स आसान रहते हैं, जबकि एक्टिविटी और वर्कआउट के लिए टैम्पोन बेहतर होते हैं। हर 4-6 घंटे में बदलें।`;
      }
      return `${prefix}यह स्वास्थ्य से जुड़ा एक जरूरी सवाल है। पर्याप्त आराम और सही डाइट का ध्यान रखें।`;
    } else {
      const prefix = name ? `${name}, ` : '';
      if (q.includes('cramp') || q.includes('pain')) {
        return `${prefix}applying a warm heating pad to your lower abdomen helps ease period cramps quickly. Rest and hydration are key.`;
      }
      if (q.includes('pad') || q.includes('tampon')) {
        return `${prefix}both pads and tampons are safe options. Pads are beginner-friendly, while tampons offer more mobility. Change every 4-6 hours.`;
      }
      return `${prefix}that is an important wellness question. Rest and balanced nutrition are key.`;
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const cleanName = tempName.trim();
    const cleanKey = tempKey.trim();

    setUserName(cleanName);
    setApiKey(cleanKey);

    if (cleanName) {
      localStorage.setItem('kamakhya_user_name', cleanName);
    } else {
      localStorage.removeItem('kamakhya_user_name');
    }

    if (cleanKey) {
      localStorage.setItem('kamakhya_groq_api_key', cleanKey);
    } else {
      localStorage.removeItem('kamakhya_groq_api_key');
    }

    setShowSettings(false);
    const isHi = currentLang === 'hi';
    setMessages(prev => [
      ...prev,
      {
        sender: 'ritvi',
        text: isHi
          ? `आपकी सेटिंग्स सुरक्षित कर ली गई हैं${cleanName ? ', ' + cleanName : ''}!`
          : `Settings saved successfully${cleanName ? ', ' + cleanName : ''}!`
      }
    ]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    const isHi = currentLang === 'hi';

    // If nickname is not set yet
    if (!userName) {
      const extractedName = userText.replace(/mera naam |my name is |naam |i am /gi, '').trim();
      const validName = extractedName || userText;
      setUserName(validName);
      setTempName(validName);
      localStorage.setItem('kamakhya_user_name', validName);

      setMessages(prev => [
        ...prev,
        { sender: 'user', text: userText },
        {
          sender: 'ritvi',
          text: isHi
            ? `बहुत प्यारा नाम है आपका, ${validName}! ❤️ अब आप पीरियड्स, क्रैम्प्स या सेहत से जुड़ा कोई भी सवाल पूछ सकती हैं।`
            : `Nice to meet you, ${validName}! ❤️ Feel free to ask anything about cycle tracking, pregnancy, or wellness.`
        }
      ]);
      return;
    }

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    const activeApiKey = (apiKey || '').trim() || DEFAULT_GROQ_KEY;

    try {
      const langInstruction = isHi
        ? 'Respond entirely in warm, compassionate Hindi (conversational, natural, friendly).'
        : 'Respond entirely in warm, clear, empathetic English.';

      // Groq Cloud API endpoint
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeApiKey}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: `You are Ritvi, a compassionate privacy-first AI companion for women's wellness and menstrual health in India. User's nickname: "${userName || 'Friend'}". Always address them warmly by their name. Language rule: ${langInstruction}`
            },
            {
              role: 'user',
              content: userText
            }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        console.error("Groq API Error Detail:", data?.error || data);
        throw new Error(data?.error?.message || `HTTP ${response.status}`);
      }

      const aiReply = data?.choices?.[0]?.message?.content;

      if (aiReply) {
        setMessages(prev => [...prev, { sender: 'ritvi', text: aiReply }]);
      } else {
        throw new Error('Empty response');
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      const fallback = getOfflineAnswer(userText, userName, isHi);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ritvi',
          text: isHi ? `${fallback} (ऑफ़लाइन उत्तर)` : `${fallback} (Offline response)`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  const isHi = currentLang === 'hi';

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[420px] h-[550px] rounded-3xl bg-white/95 backdrop-blur-xl border border-rose-200/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-md">
            <RitviAvatar size={34} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm">Ritvi</h3>
              <Sparkles className="h-3 w-3 text-amber-200" />
            </div>
            <p className="text-[11px] text-white/85">
              {userName ? `${userName}'s Companion` : 'AI Companion'} · {isHi ? 'हिंदी' : 'English'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            title="Profile & API Settings"
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition text-white"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings ? (
        <form onSubmit={handleSaveSettings} className="p-5 flex-1 bg-[#FFF9F6] space-y-4 overflow-y-auto text-xs">
          <div className="border-b pb-2">
            <h4 className="font-bold text-sm text-[#3A1D28] flex items-center gap-1.5">
              <User className="h-4 w-4 text-rose-500" /> {isHi ? 'निजी प्रोफ़ाइल (लोकल)' : 'Privacy & Local Profile'}
            </h4>
            <p className="text-gray-500 text-[11px] mt-0.5">
              {isHi ? 'यह डेटा किसी सर्वर पर नहीं जाता, सिर्फ आपकी डिवाइस में रहता है।' : 'Saved securely on your device only. No external server.'}
            </p>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              {isHi ? 'आपका नाम (Nickname):' : 'Your Nickname:'}
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder={isHi ? "जैसे: रिया, प्रिया..." : "e.g. Riya, Priya..."}
              className="w-full px-3 py-2 border border-rose-200 rounded-xl outline-none focus:border-rose-500 bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1 flex items-center gap-1">
              <Key className="h-3.5 w-3.5 text-amber-500" /> Groq API Key ({isHi ? 'वैकल्पिक' : 'Optional'}):
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-3 py-2 border border-rose-200 rounded-xl outline-none focus:border-rose-500 bg-white"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              {isHi
                ? 'लाइव AI जवाबों के लिए अपनी Groq Key (gsk_...) दर्ज करें।'
                : 'Enter your Groq Key (starts with gsk_...) for fast inference.'}
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition"
            >
              {isHi ? 'सेव करें' : 'Save Details'}
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
          </div>
        </form>
      ) : (
        /* Messages Window */
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FFF9F6]/60">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.sender === 'ritvi' ? (
                <div className="shrink-0 mt-1">
                  <RitviAvatar size={24} />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-rose-500 text-white grid place-items-center text-xs shrink-0 mt-1 font-bold">
                  {userName ? userName[0].toUpperCase() : 'U'}
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-rose-500 text-white rounded-br-none shadow-sm'
                    : 'bg-white text-[#3A1D28] border border-rose-100 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-rose-500 text-xs pl-8">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>{isHi ? 'ऋत्वि सोच रही है...' : 'Ritvi is thinking...'}</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* Input Bar */}
      {!showSettings && (
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-rose-100 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              !userName
                ? (isHi ? "कृपया अपना नाम लिखें..." : "Please enter your nickname...")
                : (isHi ? `${userName}, अपना सवाल पूछें...` : `Ask anything, ${userName}...`)
            }
            className="flex-1 px-4 py-2.5 rounded-full bg-rose-50/50 border border-rose-200 text-xs sm:text-sm text-[#3A1D28] outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-10 w-10 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white grid place-items-center shadow-md active:scale-95 transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}