import { Socket, Server as SocketIOServer } from 'socket.io';
import { getDatabase } from '../database/init.js';

export function setupMessageHandlers(socket: Socket, io: SocketIOServer) {
  // Send message with embeds and attachments
  socket.on(
    'message:send',
    (data: {
      channelId: string;
      content: string;
      userId: string;
      username: string;
      avatar?: string;
      embeds?: any[];
      attachments?: any[];
    }) => {
      const messageId = `msg_${Date.now()}`;
      const db = getDatabase();

      db.run(
        `INSERT INTO messages (id, content, author_id, author_name, author_avatar, channel_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          messageId,
          data.content,
          data.userId,
          data.username,
          data.avatar,
          data.channelId,
          new Date().toISOString(),
        ],
        (err: Error | null) => {
          if (!err) {
            io.to(`channel_${data.channelId}`).emit('message:new', {
              id: messageId,
              content: data.content,
              authorId: data.userId,
              authorName: data.username,
              authorAvatar: data.avatar,
              channelId: data.channelId,
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

  // Edit message
  socket.on(
    'message:edit',
    (data: { messageId: string; content: string; channelId: string }) => {
      const db = getDatabase();
      db.run(
        'UPDATE messages SET content = ?, edited_at = ? WHERE id = ?',
        [data.content, new Date().toISOString(), data.messageId],
        (err: Error | null) => {
          if (!err) {
            io.to(`channel_${data.channelId}`).emit('message:updated', {
              messageId: data.messageId,
              content: data.content,
              editedAt: new Date(),
            });
          }
        }
      );
    }
  );

  // Delete message
  socket.on(
    'message:delete',
    (data: { messageId: string; channelId: string }) => {
      const db = getDatabase();
      db.run(
        'UPDATE messages SET deleted_at = ? WHERE id = ?',
        [new Date().toISOString(), data.messageId],
        (err: Error | null) => {
          if (!err) {
            io.to(`channel_${data.channelId}`).emit('message:deleted', {
              messageId: data.messageId,
            });
          }
        }
      );
    }
  );

  // Pin/Unpin message
  socket.on(
    'message:pin',
    (data: { messageId: string; channelId: string; pinned: boolean }) => {
      const db = getDatabase();
      db.run(
        'UPDATE messages SET pinned = ? WHERE id = ?',
        [data.pinned ? 1 : 0, data.messageId],
        (err: Error | null) => {
          if (!err) {
            io.to(`channel_${data.channelId}`).emit('message:pinned', {
              messageId: data.messageId,
              pinned: data.pinned,
            });
          }
        }
      );
    }
  );

  // Add reaction
  socket.on(
    'message:reaction:add',
    (data: { messageId: string; emoji: string; channelId: string; userId: string }) => {
      const db = getDatabase();
      const reactionId = `react_${Date.now()}`;

      db.run(
        `INSERT INTO message_reactions (id, message_id, emoji, user_id, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [reactionId, data.messageId, data.emoji, data.userId, new Date().toISOString()],
        (err: Error | null) => {
          if (!err) {
            io.to(`channel_${data.channelId}`).emit('message:reaction:added', {
              messageId: data.messageId,
              emoji: data.emoji,
              userId: data.userId,
            });
          }
        }
      );
    }
  );

  // Remove reaction
  socket.on(
    'message:reaction:remove',
    (data: { messageId: string; emoji: string; channelId: string; userId: string }) => {
      const db = getDatabase();

      db.run(
        'DELETE FROM message_reactions WHERE message_id = ? AND emoji = ? AND user_id = ?',
        [data.messageId, data.emoji, data.userId],
        (err: Error | null) => {
          if (!err) {
            io.to(`channel_${data.channelId}`).emit('message:reaction:removed', {
              messageId: data.messageId,
              emoji: data.emoji,
              userId: data.userId,
            });
          }
        }
      );
    }
  );

  // Create thread
  socket.on(
    'thread:create',
    (data: { messageId: string; threadName: string; channelId: string }) => {
      const db = getDatabase();
      const threadId = `thread_${Date.now()}`;

      db.run(
        `INSERT INTO message_threads (id, name, message_id, channel_id, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [threadId, data.threadName, data.messageId, data.channelId, new Date().toISOString()],
        (err: Error | null) => {
          if (!err) {
            io.to(`channel_${data.channelId}`).emit('thread:created', {
              threadId,
              messageId: data.messageId,
              threadName: data.threadName,
            });
          }
        }
      );
    }
  );
}
