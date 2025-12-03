import { Socket, Server as SocketIOServer } from 'socket.io';
import { getDatabase } from '../database/init.js';

export function setupServerHandlers(socket: Socket, io: SocketIOServer) {
  // Create server
  socket.on(
    'server:create',
    (data: {
      name: string;
      ownerId: string;
      icon?: string;
    }) => {
      const db = getDatabase();
      const serverId = `srv_${Date.now()}`;

      db.run(
        `INSERT INTO servers (id, name, owner_id, icon, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [serverId, data.name, data.ownerId, data.icon, new Date().toISOString()],
        (err: Error | null) => {
          if (!err) {
            // Add owner as member
            const memberId = `mem_${Date.now()}`;
            db.run(
              `INSERT INTO server_members (id, user_id, server_id, joined_at)
               VALUES (?, ?, ?, ?)`,
              [memberId, data.ownerId, serverId, new Date().toISOString()],
              (err: Error | null) => {
                if (!err) {
                  // Create general channel
                  const channelId = `ch_${Date.now()}`;
                  db.run(
                    `INSERT INTO channels (id, name, server_id, type, position, created_at)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [channelId, 'general', serverId, 'text', 0, new Date().toISOString()],
                    (err: Error | null) => {
                      if (!err) {
                        socket.emit('server:created', {
                          serverId,
                          name: data.name,
                          icon: data.icon,
                          channels: [{ id: channelId, name: 'general' }],
                        });

                        io.emit('server:list:update');
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  );

  // Join server
  socket.on(
    'server:join',
    (data: { serverId: string; userId: string }) => {
      const db = getDatabase();
      const memberId = `mem_${Date.now()}`;

      db.run(
        `INSERT INTO server_members (id, user_id, server_id, joined_at)
         VALUES (?, ?, ?, ?)`,
        [memberId, data.userId, data.serverId, new Date().toISOString()],
        (err: Error | null) => {
          if (!err) {
            socket.join(`server_${data.serverId}`);
            io.to(`server_${data.serverId}`).emit('server:member:joined', {
              userId: data.userId,
            });
          }
        }
      );
    }
  );

  // Leave server
  socket.on(
    'server:leave',
    (data: { serverId: string; userId: string }) => {
      const db = getDatabase();

      db.run(
        `DELETE FROM server_members WHERE user_id = ? AND server_id = ?`,
        [data.userId, data.serverId],
        (err: Error | null) => {
          if (!err) {
            socket.leave(`server_${data.serverId}`);
            io.to(`server_${data.serverId}`).emit('server:member:left', {
              userId: data.userId,
            });
          }
        }
      );
    }
  );

  // Create role
  socket.on(
    'role:create',
    (data: {
      serverId: string;
      name: string;
      color: string;
      permissions: bigint;
    }) => {
      const db = getDatabase();
      const roleId = `role_${Date.now()}`;

      db.run(
        `INSERT INTO roles (id, server_id, name, color, permissions, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          roleId,
          data.serverId,
          data.name,
          data.color,
          data.permissions.toString(),
          new Date().toISOString(),
        ],
        (err: Error | null) => {
          if (!err) {
            io.to(`server_${data.serverId}`).emit('role:created', {
              roleId,
              name: data.name,
              color: data.color,
            });
          }
        }
      );
    }
  );

  // Assign role to member
  socket.on(
    'member:role:add',
    (data: {
      serverId: string;
      userId: string;
      roleId: string;
    }) => {
      const db = getDatabase();

      db.all(
        `SELECT id FROM server_members WHERE user_id = ? AND server_id = ?`,
        [data.userId, data.serverId],
        (err: Error | null, rows: any) => {
          if (!err && rows && rows.length > 0) {
            db.run(
              `INSERT OR IGNORE INTO member_roles (member_id, role_id)
               VALUES (?, ?)`,
              [rows[0].id, data.roleId],
              (err: Error | null) => {
                if (!err) {
                  io.to(`server_${data.serverId}`).emit('member:role:added', {
                    userId: data.userId,
                    roleId: data.roleId,
                  });
                }
              }
            );
          }
        }
      );
    }
  );

  // Remove role from member
  socket.on(
    'member:role:remove',
    (data: {
      serverId: string;
      userId: string;
      roleId: string;
    }) => {
      const db = getDatabase();

      db.all(
        `SELECT id FROM server_members WHERE user_id = ? AND server_id = ?`,
        [data.userId, data.serverId],
        (err: Error | null, rows: any) => {
          if (!err && rows && rows.length > 0) {
            db.run(
              `DELETE FROM member_roles WHERE member_id = ? AND role_id = ?`,
              [rows[0].id, data.roleId],
              (err: Error | null) => {
                if (!err) {
                  io.to(`server_${data.serverId}`).emit('member:role:removed', {
                    userId: data.userId,
                    roleId: data.roleId,
                  });
                }
              }
            );
          }
        }
      );
    }
  );

  // Ban user
  socket.on(
    'member:ban',
    (data: {
      serverId: string;
      userId: string;
      reason?: string;
      bannedBy: string;
    }) => {
      const db = getDatabase();
      const banId = `ban_${Date.now()}`;

      db.run(
        `INSERT INTO bans (id, server_id, user_id, reason, banned_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [banId, data.serverId, data.userId, data.reason, data.bannedBy, new Date().toISOString()],
        (err: Error | null) => {
          if (!err) {
            db.run(
              `DELETE FROM server_members WHERE user_id = ? AND server_id = ?`,
              [data.userId, data.serverId],
              (err: Error | null) => {
                if (!err) {
                  io.to(`server_${data.serverId}`).emit('member:banned', {
                    userId: data.userId,
                    reason: data.reason,
                  });
                }
              }
            );
          }
        }
      );
    }
  );

  // Kick user
  socket.on(
    'member:kick',
    (data: {
      serverId: string;
      userId: string;
      reason?: string;
    }) => {
      const db = getDatabase();

      db.run(
        `DELETE FROM server_members WHERE user_id = ? AND server_id = ?`,
        [data.userId, data.serverId],
        (err: Error | null) => {
          if (!err) {
            io.to(`server_${data.serverId}`).emit('member:kicked', {
              userId: data.userId,
              reason: data.reason,
            });
          }
        }
      );
    }
  );

  // Create invite
  socket.on(
    'invite:create',
    (data: {
      serverId: string;
      createdBy: string;
      expiresAt?: Date;
      maxUses?: number;
    }) => {
      const db = getDatabase();
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      db.run(
        `INSERT INTO invites (code, server_id, created_by, expires_at, max_uses, uses, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          inviteCode,
          data.serverId,
          data.createdBy,
          data.expiresAt?.toISOString(),
          data.maxUses,
          0,
          new Date().toISOString(),
        ],
        (err: Error | null) => {
          if (!err) {
            socket.emit('invite:created', { code: inviteCode });
          }
        }
      );
    }
  );
}
