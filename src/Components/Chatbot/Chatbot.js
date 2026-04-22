import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const API_BASE = "http://localhost:5000";
const CHAT_ENDPOINT = `${API_BASE}/api/chat`;
const IMAGE_BASE = `${API_BASE}/api/pets/images`;

const Chatbot = () => {
  const [session, setSession] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('online');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTyping, setShowTyping] = useState(false);
  const chatMessagesRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping]);

  const checkBackendHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      if (res.ok) {
        setStatus("online");
      } else {
        setStatus("offline");
      }
    } catch {
      setStatus("offline");
    }
  };

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isWaiting) return;

    setShowWelcome(false);
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');
    setIsWaiting(true);
    setShowTyping(true);

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session: session }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setSession(data.session);
      setMessages(prev => [...prev, { role: 'bot', text: data.reply, pets: data.pets }]);
      setStatus("online");
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "⚠️ **Oops!** I couldn't connect to the server. Please make sure the backend is running on `localhost:5000`.\n\nRun: `python app.py` in the backend folder."
      }]);
      setStatus("offline");
    } finally {
      setIsWaiting(false);
      setShowTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInputValue(prompt);
    sendMessage();
  };

  const formatMarkdown = (text) => {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;font-size:0.82em;">$1</code>')
      .replace(/\n/g, "<br>");
    html = html.replace(/(?:^|<br>)\s*[•\-]\s+/g, '<br>• ');
    return html;
  };

  const createPetCards = (pets) => {
    return pets.map((pet, index) => {
      const scoreClass = pet.score >= 70 ? "high" : pet.score >= 50 ? "medium" : "low";
      const reasonsHTML = pet.reasons.map(r => `<div class="pet-card-reason">${r}</div>`).join("");
      return (
        <div key={index} className="pet-card" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="pet-card-image-wrapper">
            <img
              className="pet-card-image"
              src={`${IMAGE_BASE}/${pet.image}`}
              alt={pet.name}
              loading="lazy"
              onError={(e) => e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%22%231a1a2e%22 width=%22400%22 height=%22300%22/><text fill=%22%236b7280%22 font-family=%22sans-serif%22 font-size=%2240%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>🐾</text></svg>'}
            />
            <span className="pet-card-type">{pet.type}</span>
            <span className={`pet-card-score ${scoreClass}`}>{pet.score}% Match</span>
          </div>
          <div className="pet-card-body">
            <h3 className="pet-card-name">{pet.name}</h3>
            <div className="pet-card-lifespan">⏳ {pet.lifespan}</div>
            <div className="score-bar-container">
              <div className="score-bar-label">
                <span>Compatibility</span>
                <span>{pet.score}%</span>
              </div>
              <div className="score-bar">
                <div className="score-bar-fill" style={{ width: `${pet.score}%` }}></div>
              </div>
            </div>
            <div className="pet-card-reasons" dangerouslySetInnerHTML={{ __html: reasonsHTML }}></div>
            <p className="pet-card-description">{pet.description}</p>
          </div>
        </div>
      );
    });
  };

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  return (
    <div className="chatbot-page">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🐾</span>
              <div className="logo-text">
                <h1>PetMatch AI</h1>
                <p className="tagline">Find Your Perfect Companion</p>
              </div>
            </div>
            <div className="header-status">
              <span className={`status-dot ${status === 'offline' ? 'offline' : ''}`}></span>
              <span className="status-text">{status === 'online' ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </header>
        <main className="chat-area" ref={chatMessagesRef}>
          <div className="chat-messages">
            {showWelcome && (
              <div className="welcome-section">
                <span className="welcome-icon">🐾</span>
                <h2 className="welcome-title">Welcome to PetMatch AI</h2>
                <p className="welcome-subtitle">
                  Tell me about your lifestyle and I'll recommend the perfect pet companion for you!
                </p>
                <div className="quick-prompts">
                  <button className="quick-prompt" onClick={() => handleQuickPrompt("I live in a small apartment and I'm very busy")}>🏢 Small apartment, busy schedule</button>
                  <button className="quick-prompt" onClick={() => handleQuickPrompt("I have a big house with a yard, lots of free time, and I love hiking")}>🏡 Big house, very active</button>
                  <button className="quick-prompt" onClick={() => handleQuickPrompt("I want a quiet, low-maintenance pet for my apartment on a budget")}>🤫 Quiet & budget-friendly</button>
                  <button className="quick-prompt" onClick={() => handleQuickPrompt("I have kids and a moderate-sized home in a hot climate")}>👨‍👩‍👧‍👦 Family with kids</button>
                  <button className="quick-prompt" onClick={() => handleQuickPrompt("Hi! I'm looking for a pet")}>👋 Just say hello</button>
                </div>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-avatar">{msg.role === 'user' ? '👤' : '🤖'}</div>
                <div className="message-bubble">
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}></div>
                  {msg.pets && msg.pets.length > 0 && (
                    <div className="pet-cards-container">
                      {createPetCards(msg.pets)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {showTyping && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <footer className="input-area">
          <div className="input-container">
            <input
              type="text"
              ref={messageInputRef}
              className="message-input"
              placeholder="Describe your lifestyle or answer the question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isWaiting}
              autoComplete="off"
              autoFocus
            />
            <button className="send-btn" onClick={sendMessage} disabled={isWaiting}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <p className="input-hint">💡 Tip: You can describe everything at once — e.g., "I live in a small apartment, I'm very busy, hot climate, low activity"</p>
        </footer>
      </div>
    </div>
  );
};

export default Chatbot;