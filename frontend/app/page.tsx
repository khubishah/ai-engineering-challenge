'use client';

import { useState, useRef, useEffect, ReactElement } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // get api key from env

    console.log("api key", process.env.NEXT_PUBLIC_OPENAI_API_KEY)
    console.log("ip address", process.env.NEXT_PUBLIC_API_URL)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log("api url", apiUrl)
      const response = await axios.post(`${apiUrl}/api/chat`, {
        developer_message: 'You are a helpful AI assistant.',
        user_message: userMessage,
        model: 'gpt-4.1-mini',
        api_key: process.env.NEXT_PUBLIC_OPENAI_API_KEY
      });

      // Handle the streaming response
      console.log("response", response);
      const responseText = response.data;
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4 flex flex-col h-[80vh]">
        <h1 className="text-2xl font-bold text-center mb-4">AI Chat Assistant</h1>
        
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex flex-col gap-1 shadow transition-all duration-200 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white ml-auto border-2 border-blue-300'
                  : 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-gray-900 border-2 border-yellow-300'
              } max-w-[80%]`}
            >
              <span className="text-xs font-semibold mb-1 flex items-center gap-1">
                {message.role === 'user' ? '🧑 You' : '🤖 Agent'}
              </span>
              {message.role === 'assistant' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  components={{
                    h1: (props) => <h1 className="text-xl font-bold mt-2 mb-1 text-blue-700" {...props} />,
                    h2: (props) => <h2 className="text-lg font-semibold mt-2 mb-1 text-blue-600" {...props} />,
                    h3: (props) => <h3 className="text-base font-semibold mt-2 mb-1 text-blue-500" {...props} />,
                    ul: (props) => <ul className="list-disc ml-6 my-2 text-base" {...props} />,
                    ol: (props) => <ol className="list-decimal ml-6 my-2 text-base" {...props} />,
                    li: (props) => <li className="mb-1" {...props} />,
                    code({node, className, children, ...props}) {
                      const isInline = !(className && className.includes('language-'));
                      return isInline ? (
                        <code className="bg-gray-200 rounded px-1 py-0.5 text-pink-600 font-mono text-sm" {...props}>{children}</code>
                      ) : (
                        <pre className="bg-gray-900 text-green-200 rounded p-3 overflow-x-auto my-2"><code className={className} {...props}>{children}</code></pre>
                      );
                    },
                    blockquote: (props) => <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 my-2" {...props} />,
                    strong: (props) => <strong className="text-blue-700 font-bold" {...props} />,
                    em: (props) => <em className="text-pink-600" {...props} />,
                    a: (props) => <a className="text-blue-500 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <span className="whitespace-pre-line">{message.content}</span>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[80%]">
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={isLoading}
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
    </main>
  );
} 