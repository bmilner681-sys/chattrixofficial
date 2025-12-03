import { Socket, Server as SocketIOServer } from 'socket.io';
import { getDatabase } from '../database/init.js';

export function setupDirectMessageHandlers(socket: Socket, io: SocketIOServer) {
  // Send direct message
  socket.on(
    'dm:send',
    (data: {
      recipientId: string;
      content: string;
      senderId: string;
      senderName: string;
      senderAvatar?: string;
      embeds?: any[];
      attachments?: any[];
    }) => {
      const dmId = `dm_${Date.now()}`;
      const db = getDatabase();

      db.run(
        `INSERT INTO direct_messages (id, content, sender_id, sender_name, sender_avatar, recipient_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          dmId,
          data.content,
          data.senderId,
          data.senderName,
          data.senderAvatar,
          data.recipientId,
          new Date().toISOString(),
        ],
        (err: Error | null) => {
          if (!err) {
            io.to(`user_${data.recipientId}`).emit('dm:new', {
              id: dmId,
              content: data.content,
              senderId: data.senderId,
              senderName: data.senderName,
              senderAvatar: data.senderAvatar,
              recipientId: data.recipientId,
              createdAt: new Date(),
              embeds: data.embeds || [],
              attachments: data.attachments || [],
              reactions: [],
            });
          }
        }
      );
    }
  );

  // Edit DM
  socket.on(
    'dm:edit',
    (data: { dmId: string; content: string; recipientId: string; senderId: string }) => {
      const db = getDatabase();

      db.run(
        'UPDATE direct_messages SET content = ?, edited_at = ? WHERE id = ?',
        [data.content, new Date().toISOString(), data.dmId],
        (err: Error | null) => {
          if (!err) {
            io.to(`user_${data.recipientId}`).emit('dm:updated', {
              dmId: data.dmId,
              content: data.content,
              editedAt: new Date(),
            });
            io.to(`user_${data.senderId}`).emit('dm:updated', {
              dmId: data.dmId,
              content: data.content,
              editedAt: new Date(),
            });
          }
        }
      );
    }
  );

  // Delete DM
  socket.on(
    'dm:delete',
    (data: { dmId: string; recipientId: string; senderId: string }) => {
      const db = getDatabase();

      db.run('DELETE FROM direct_messages WHERE id = ?', [data.dmId], (err: Error | null) => {
        if (!err) {
          io.to(`user_${data.recipientId}`).emit('dm:deleted', { dmId: data.dmId });
          io.to(`user_${data.senderId}`).emit('dm:deleted', { dmId: data.dmId });
        }
      });
    }
  );

  // Add reaction to DM
  socket.on(
    'dm:reaction:add',
    (data: { dmId: string; emoji: string; recipientId: string; senderId: string; userId: string }) => {
      const db = getDatabase();
      const reactionId = `react_dm_${Date.now()}`;

      db.run(
        `INSERT INTO dm_reactions (id, dm_id, emoji, user_id, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [reactionId, data.dmId, data.emoji, data.userId, new Date().toISOString()],
        (err: Error | null) => {
          if (!err) {
            io.to(`user_${data.recipientId}`).emit('dm:reaction:added', {
              dmId: data.dmId,
              emoji: data.emoji,
              userId: data.userId,
            });
            io.to(`user_${data.senderId}`).emit('dm:reaction:added', {
              dmId: data.dmId,
              emoji: data.emoji,
              userId: data.userId,
            });
          }
        }
      );
    }
  );

  // Remove reaction from DM
  socket.on(
    'dm:reaction:remove',
    (data: { dmId: string; emoji: string; recipientId: string; senderId: string; userId: string }) => {
      const db = getDatabase();

      db.run(
        'DELETE FROM dm_reactions WHERE dm_id = ? AND emoji = ? AND user_id = ?',
        [data.dmId, data.emoji, data.userId],
        (err: Error | null) => {
          if (!err) {
            io.to(`user_${data.recipientId}`).emit('dm:reaction:removed', {
              dmId: data.dmId,
              emoji: data.emoji,
              userId: data.userId,
            });
            io.to(`user_${data.senderId}`).emit('dm:reaction:removed', {
              dmId: data.dmId,
              emoji: data.emoji,
              userId: data.userId,
            });
          }
        }
      );
    }
  );

  // Get DM history
  socket.on(
    'dm:history',
    (data: { userId1: string; userId2: string; limit?: number }) => {
      const db = getDatabase();
      const limit = data.limit || 50;

      db.all(
        `SELECT * FROM direct_messages
         WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
         ORDER BY created_at DESC LIMIT ?`,
        [data.userId1, data.userId2, data.userId2, data.userId1, limit],
        (err: Error | null, rows: any) => {
          if (!err) {
            socket.emit('dm:history-response', {
              messages: (rows || []).reverse(),
            });
          }
        }
      );
    }
  );

  // Open DM channel
  socket.on(
    'dm:open',
    (data: { recipientId: string; userId: string }) => {
      socket.join(`dm_${data.userId}_${data.recipientId}`);
      socket.join(`dm_${data.recipientId}_${data.userId}`);
    }
  );

  // Close DM channel
  socket.on(
    'dm:close',
    (data: { recipientId: string; userId: string }) => {
      socket.leave(`dm_${data.userId}_${data.recipientId}`);
      socket.leave(`dm_${data.recipientId}_${data.userId}`);
    }
  );
}
