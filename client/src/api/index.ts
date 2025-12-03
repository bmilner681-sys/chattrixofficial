import { socket } from '../socket';

export async function registerUser(username: string, email: string, password: string) {
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const response = await fetch('http://localhost:3001/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
}

export function sendMessage(
  channelId: string,
  content: string,
  userId: string,
  username: string,
  avatar?: string
) {
  socket.emit('message:send', {
    channelId,
    content,
    userId,
    username,
    avatar,
  });
}

export function sendDirectMessage(
  recipientId: string,
  content: string,
  senderId: string,
  senderName: string,
  senderAvatar?: string
) {
  socket.emit('dm:send', {
    recipientId,
    content,
    senderId,
    senderName,
    senderAvatar,
  });
}

export function addMessageReaction(messageId: string, emoji: string, channelId: string, userId: string) {
  socket.emit('message:reaction:add', {
    messageId,
    emoji,
    channelId,
    userId,
  });
}

export function removeMessageReaction(messageId: string, emoji: string, channelId: string, userId: string) {
  socket.emit('message:reaction:remove', {
    messageId,
    emoji,
    channelId,
    userId,
  });
}

export function editMessage(messageId: string, content: string, channelId: string) {
  socket.emit('message:edit', {
    messageId,
    content,
    channelId,
  });
}

export function deleteMessage(messageId: string, channelId: string) {
  socket.emit('message:delete', {
    messageId,
    channelId,
  });
}

