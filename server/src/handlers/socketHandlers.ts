import { Socket, Server as SocketIOServer } from 'socket.io';
import { getDatabase } from '../database/init.js';
import { setupMessageHandlers } from './messageHandlers.js';
import { setupServerHandlers } from './serverHandlers.js';
import { setupPresenceHandlers } from './presenceHandlers.js';
import { setupDirectMessageHandlers } from './dmHandlers.js';

interface UserSocket {
  userId: string;
  username: string;
  socketId: string;
}

const activeUsers: Map<string, UserSocket> = new Map();

export function setupSocketHandlers(socket: Socket, io: SocketIOServer) {
  // User connects
  socket.on('user:join', (data: { userId: string; username: string }) => {
    const user: UserSocket = {
      userId: data.userId,
      username: data.username,
      socketId: socket.id,
    };

    activeUsers.set(data.userId, user);
    socket.join(`user_${data.userId}`);

    io.emit('users:online', Array.from(activeUsers.values()));
    console.log(`✅ ${data.username} joined`);
  });

  // Join channel
  socket.on('channel:join', (data: { channelId: string; userId: string }) => {
    socket.join(`channel_${data.channelId}`);
  });

  // Leave channel
  socket.on('channel:leave', (data: { channelId: string }) => {
    socket.leave(`channel_${data.channelId}`);
  });

  // Join server
  socket.on('server:join', (data: { serverId: string; userId: string }) => {
    socket.join(`server_${data.serverId}`);
  });

  // Leave server
  socket.on('server:leave', (data: { serverId: string }) => {
    socket.leave(`server_${data.serverId}`);
  });

  // Setup all handler categories
  setupMessageHandlers(socket, io);
  setupServerHandlers(socket, io);
  setupPresenceHandlers(socket, io);
  setupDirectMessageHandlers(socket, io);

  // User disconnect
  socket.on('disconnect', () => {
    for (const [userId, user] of activeUsers.entries()) {
      if (user.socketId === socket.id) {
        activeUsers.delete(userId);
        io.emit('users:online', Array.from(activeUsers.values()));
        console.log(`❌ ${user.username} left`);
        break;
      }
    }
  });
}
