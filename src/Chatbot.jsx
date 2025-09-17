// Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SpinningEarth from './SpinningEarth';
import './Chatbot.css';

// משתנה סביבה שמכיל את כתובת השרת.
// נטפל גם במקרה שבו המשתנה אינו מוגדר.

const API_URL = process.env.REACT_APP_API_URL;

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // פונקציית גלילה אוטומטית
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // מציג הודעת פתיחה בטעינה הראשונית של הקומפוננטה.
  useEffect(() => {
    setMessages([
      { text: "👋 שלום! אני כאן כדי לעזור לך לתכנן טיולים, נדאג לחזות את מזג האוויר לכל יום ולהציע את הנסיעות הטובות ביותר .", sender: "bot" },
    ]);
  }, []);

  // גלילה אוטומטית בכל פעם שמערך ההודעות מתעדכן.
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // פונקציית שליחת ההודעה לשרת
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // ודא שה-API_URL קיים לפני שליחת הבקשה
    if (!API_URL) {
      console.error("API URL is not defined. Please check your environment variables.");
      const errorMessage = { text: 'אירעה שגיאה: כתובת השרת לא הוגדרה כראוי.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      return;
    }

    const userMessage = { text: input, sender: 'user' };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, { message: userMessage.text });
      const botResponse = response?.data?.response;

      if (botResponse && typeof botResponse === 'string') {
        const botMessage = { text: botResponse, sender: 'bot' };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = { text: 'השרת לא החזיר תשובה תקינה.', sender: 'bot' };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: 'אופס! משהו השתבש, אנא נסה שוב מאוחר יותר.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <SpinningEarth />
      <div className="chatbot-header">
        <h1>TripMate</h1>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            {msg.text && typeof msg.text === 'string' ? (
              msg.text.split('\n').map((line, lineIndex) => <p key={lineIndex}>{line}</p>)
            ) : (
              <p>{JSON.stringify(msg.text)}</p>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message-bubble bot is-loading">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbot-input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="✨ מזמין אותך לשאול אותי כל שאלה"
        />
        <button type="submit" disabled={isLoading}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export default Chatbot;