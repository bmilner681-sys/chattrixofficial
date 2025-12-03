import { Socket, Server as SocketIOServer } from 'socket.io';
import { getDatabase } from '../database/init.js';

interface UserPresence {
  userId: string;
  username: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  statusMessage?: string;
  socketId: string;
  lastSeen: Date;
}

const presenceMap: Map<string, UserPresence> = new Map();

export function setupPresenceHandlers(socket: Socket, io: SocketIOServer) {
  // User presence update
  socket.on(
    'presence:update',
    (data: {
      userId: string;
      username: string;
      status: 'online' | 'idle' | 'dnd' | 'offline';
      statusMessage?: string;
    }) => {
      const db = getDatabase();

      const presence: UserPresence = {
        userId: data.userId,
        username: data.username,
        status: data.status,
        statusMessage: data.statusMessage,
        socketId: socket.id,
        lastSeen: new Date(),
      };

      presenceMap.set(data.userId, presence);

      db.run(
        `UPDATE users SET status = ?, status_message = ?, updated_at = ? WHERE id = ?`,
        [data.status, data.statusMessage, new Date().toISOString(), data.userId],
        (err: Error | null) => {
          if (!err) {
            io.emit('presence:updated', {
              userId: data.userId,
              username: data.username,
              status: data.status,
              statusMessage: data.statusMessage,
            });
          }
        }
      );
    }
  );

  // Get online users
  socket.on('presence:get-online', () => {
    const onlineUsers = Array.from(presenceMap.values()).filter(
      (p) => p.status !== 'offline'
    );
    socket.emit('presence:online-list', onlineUsers);
  });

  // User is typing
  socket.on(
    'presence:typing',
    (data: {
      channelId: string;
      userId: string;
      username: string;
    }) => {
      io.to(`channel_${data.channelId}`).emit('presence:user-typing', {
        userId: data.userId,
        username: data.username,
      });
    }
  );

  // User stopped typing
  socket.on(
    'presence:stop-typing',
    (data: { channelId: string; userId: string }) => {
      io.to(`channel_${data.channelId}`).emit('presence:user-stop-typing', {
        userId: data.userId,
      });
    }
  );

  // Activity update
  socket.on(
    'presence:activity',
    (data: {
      userId: string;
      activityName: string;
      activityType: 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING';
    }) => {
      io.emit('presence:activity-update', {
        userId: data.userId,
        activityName: data.activityName,
        activityType: data.activityType,
      });
    }
  );

  // Track disconnect for offline status
  socket.on('disconnect', () => {
    for (const [userId, presence] of presenceMap.entries()) {
      if (presence.socketId === socket.id) {
        const db = getDatabase();
        db.run(
          `UPDATE users SET status = ? WHERE id = ?`,
          ['offline', userId],
          (err: Error | null) => {
            if (!err) {
              io.emit('presence:updated', {
                userId,
                username: presence.username,
                status: 'offline',
              });
            }
          }
        );
        presenceMap.delete(userId);
        break;
      }
    }
  });
}
