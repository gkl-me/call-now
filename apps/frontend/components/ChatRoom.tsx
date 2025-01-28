import React, { useRef, useEffect } from 'react';
import { MessageCircle, Send, SkipForward, X } from 'lucide-react';
import { ConnectedUser, Message } from '@repo/types/src/index';

interface ChatRoomProps {
  message: string;
  setMessage: (message: string) => void;
  skipConfirm: boolean;
  onSkip: () => void;
  onStop: () => void;
  messages: Message[];
  onSendMessage: () => void;
  connectedTo: ConnectedUser | null;
}

export function ChatRoom({
  message,
  setMessage,
  skipConfirm,
  onSkip,
  onStop,
  messages,
  onSendMessage,
  connectedTo,
}: ChatRoomProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col h-[500px] md:h-[600px] lg:h-[700px]">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gray-50 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-indigo-600" />
            <span className="font-semibold text-gray-800">Connected with {connectedTo?.name}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onSkip}
              className={`px-2 md:px-4 py-2 rounded-lg flex items-center space-x-1 ${
                skipConfirm
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition duration-200`}
            >
              <SkipForward className="w-4 h-4" />
              <span className="hidden md:inline">{skipConfirm ? 'Confirm Skip' : 'Skip'}</span>
            </button>
            <button
              onClick={onStop}
              className="px-2 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center space-x-1 transition duration-200"
            >
              <X className="w-4 h-4" />
              <span className="hidden md:inline">Stop</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">
              Start chatting with your new friend!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg,index) => (
                <div
                  key={index}
                  className={`flex ${msg.userId !== connectedTo?.userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] px-4 py-2 rounded-lg ${
                      msg.userId !== connectedTo?.userId 
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.userId !== connectedTo?.userId  ? 'text-indigo-200' : 'text-gray-500'
                      }`}
                    >
                        {msg.timestamp as string}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && message.trim()) {
                  onSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
            <button
              onClick={onSendMessage}
              disabled={!message.trim()}
              className="px-4 md:px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              <Send className="w-4 h-4" />
              <span className="hidden md:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}