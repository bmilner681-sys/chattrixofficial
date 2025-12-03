import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

socket.on('connect', () => {
  console.log('🔗 Connected to server');
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

export function connectSocket(userId: string, username: string) {
  if (!socket.connected) {
    socket.connect();
    socket.emit('user:join', { userId, username });
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}
