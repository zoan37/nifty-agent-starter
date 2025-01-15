'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState('User');
  const [userId, setUserId] = useState('1');
  const [version, setVersion] = useState('1.0');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when loading state changes to false
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setIsLoading(true);
    // Clear input immediately after sending
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input,
          userName,
          userId,
          version,
        }),
      });

      const data = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data[0].text 
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Add configuration inputs */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
              Version
            </label>
            <input
              id="version"
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
            />
          </div>
        </div>

        {/* Messages display */}
        <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 ml-auto max-w-[80%] text-gray-900'
                  : 'bg-gray-100 mr-auto max-w-[80%] text-gray-900'
              }`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-100 rounded-lg p-3 mr-auto max-w-[80%] text-gray-400">
              Thinking...
            </div>
          )}
          {/* Invisible div for scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-500"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
} 