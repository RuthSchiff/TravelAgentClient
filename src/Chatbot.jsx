import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SpinningEarth from './SpinningEarth'; 
import './Chatbot.css'; // נדאג ליצור את הקובץ הזה בהמשך

const API_URL = 'http://localhost:5153/chat';

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
  setMessages([{ text: "👋 שלום! אני כאן כדי לעזור לך לתכנן טיולים, נדאג לחזות את מזג האוויר לכל יום ולהציע את הנסיעות הטובות ביותר .", sender: "bot" }]);
}, []);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(API_URL, { message: userMessage.text });
            const botMessage = { text: response.data.response, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { text: 'אופס! משהו השתבש, אנא נסה שוב מאוחר יותר.', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
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
                        {msg.text.split('\n').map((line, lineIndex) => (
                            <p key={lineIndex}>{line}</p>
                        ))}
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
                    placeholder="✨ מוזמין אותך לשאול אותי כל שאלה "
                />
                <button type="submit" disabled={isLoading}>
                    <i className="fas fa-paper-plane"></i>
                </button>
              

            </form>

            
        </div>
        
    );
}

export default Chatbot;