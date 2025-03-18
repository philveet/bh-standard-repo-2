'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/ApiTest.module.css';
import chatStyles from '@/styles/OpenAITest.module.css';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ResponseData = {
  reply: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export default function OpenAITestPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Send request to API
      const response = await fetch('/api/test/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }
      
      const data: ResponseData = await response.json();
      
      // Add AI response to chat
      const aiMessage: Message = { role: 'assistant', content: data.reply };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setResponseData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while communicating with OpenAI');
      console.error('Error in OpenAI chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          onClick={() => router.push('/')} 
          className={styles.backButton}
        >
          ← Back to API Panel
        </button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Live test for OpenAI</h1>
        
        <div className={chatStyles.chatContainer}>
          <div className={chatStyles.messagesContainer}>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={message.role === 'user' ? chatStyles.userMessage : chatStyles.aiMessage}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className={chatStyles.loadingIndicator}>
                Waiting for response...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className={chatStyles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message to test OpenAI..."
              className={chatStyles.messageInput}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={chatStyles.sendButton}
              disabled={isLoading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
        
        {error && (
          <div className={chatStyles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {responseData && (
          <div className={chatStyles.statusContainer}>
            <div className={chatStyles.status}>
              <span className={chatStyles.statusLabel}>Model:</span>
              <span className={chatStyles.statusValue}>{responseData.model}</span>
            </div>
            <div className={chatStyles.status}>
              <span className={chatStyles.statusLabel}>Prompt Tokens:</span>
              <span className={chatStyles.statusValue}>{responseData.usage.prompt_tokens}</span>
            </div>
            <div className={chatStyles.status}>
              <span className={chatStyles.statusLabel}>Completion Tokens:</span>
              <span className={chatStyles.statusValue}>{responseData.usage.completion_tokens}</span>
            </div>
            <div className={chatStyles.status}>
              <span className={chatStyles.statusLabel}>Total Tokens:</span>
              <span className={chatStyles.statusValue}>{responseData.usage.total_tokens}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 