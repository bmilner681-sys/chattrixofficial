import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import { sendMessage } from '../api/index';
import './ChatWindow.css';

interface Message {
  id: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  editedAt?: Date;
  reactions?: MessageReaction[];
  embeds?: any[];
  attachments?: any[];
}

interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

interface ChatWindowProps {
  channelId: string;
  channelName: string;
  userId: string;
  username: string;
  userAvatar?: string;
}

export function ChatWindow({ channelId, channelName, userId, username }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    socket.emit('channel:join', { channelId, userId });

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserTyping = (data: { userId: string; username: string }) => {
      if (data.userId !== userId) {
        setTypingUsers((prev) => new Set(prev).add(data.username));
      }
    };

    const handleUserStopTyping = (data: { userId: string }) => {
      if (data.userId !== userId) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          // Remove user from typing list
          return new Set(newSet);
        });
      }
    };

    socket.on('message:new', handleNewMessage);
    socket.on('user:typing', handleUserTyping);
    socket.on('user:stopTyping', handleUserStopTyping);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('user:typing', handleUserTyping);
      socket.off('user:stopTyping', handleUserStopTyping);
      socket.emit('channel:leave', { channelId });
    };
  }, [channelId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(channelId, inputValue, userId, username);
      setInputValue('');
      socket.emit('user:stopTyping', { channelId, userId });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    socket.emit('user:typing', { channelId, userId, username });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('user:stopTyping', { channelId, userId });
    }, 2000);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>#{channelName}</h2>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>Welcome to #{channelName}!</p>
            <p>Start the conversation...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message">
              <strong className="author">{msg.authorName}</strong>
              <span className="timestamp">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
              <p className="content">{msg.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.size > 0 && (
        <div className="typing-indicator">
          {Array.from(typingUsers).join(', ')} is typing...
        </div>
      )}

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={`Message #${channelName}`}
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}
