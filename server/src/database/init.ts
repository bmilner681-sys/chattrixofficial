import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../data/chattrix.db');

let db: sqlite3.Database;

export function getDatabase(): sqlite3.Database {
  return db;
}

export async function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }

      db.serialize(() => {
        // Users table with enhanced fields
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            avatar TEXT,
            banner TEXT,
            bio TEXT,
            status TEXT DEFAULT 'offline',
            status_message TEXT,
            discriminator TEXT,
            verified INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Servers table
        db.run(`
          CREATE TABLE IF NOT EXISTS servers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            owner_id TEXT NOT NULL,
            icon TEXT,
            banner TEXT,
            description TEXT,
            verification_level INTEGER DEFAULT 0,
            content_filter_level INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users(id)
          )
        `);

        // Server members with roles
        db.run(`
          CREATE TABLE IF NOT EXISTS server_members (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            server_id TEXT NOT NULL,
            nickname TEXT,
            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            boosted_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (server_id) REFERENCES servers(id),
            UNIQUE(user_id, server_id)
          )
        `);

        // Roles
        db.run(`
          CREATE TABLE IF NOT EXISTS roles (
            id TEXT PRIMARY KEY,
            server_id TEXT NOT NULL,
            name TEXT NOT NULL,
            color TEXT,
            permissions TEXT,
            position INTEGER DEFAULT 0,
            mentionable INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (server_id) REFERENCES servers(id)
          )
        `);

        // Member roles junction table
        db.run(`
          CREATE TABLE IF NOT EXISTS member_roles (
            member_id TEXT NOT NULL,
            role_id TEXT NOT NULL,
            PRIMARY KEY (member_id, role_id),
            FOREIGN KEY (member_id) REFERENCES server_members(id),
            FOREIGN KEY (role_id) REFERENCES roles(id)
          )
        `);

        // Channels with categories
        db.run(`
          CREATE TABLE IF NOT EXISTS channels (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            server_id TEXT NOT NULL,
            type TEXT DEFAULT 'text',
            position INTEGER DEFAULT 0,
            topic TEXT,
            is_nsfw INTEGER DEFAULT 0,
            parent_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (server_id) REFERENCES servers(id),
            FOREIGN KEY (parent_id) REFERENCES channels(id)
          )
        `);

        // Messages with rich content
        db.run(`
          CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            content TEXT,
            author_id TEXT NOT NULL,
            author_name TEXT NOT NULL,
            author_avatar TEXT,
            channel_id TEXT NOT NULL,
            server_id TEXT,
            pinned INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            edited_at DATETIME,
            deleted_at DATETIME,
            FOREIGN KEY (author_id) REFERENCES users(id),
            FOREIGN KEY (channel_id) REFERENCES channels(id)
          )
        `);

        // Message reactions
        db.run(`
          CREATE TABLE IF NOT EXISTS message_reactions (
            id TEXT PRIMARY KEY,
            message_id TEXT NOT NULL,
            emoji TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (message_id) REFERENCES messages(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(message_id, emoji, user_id)
          )
        `);

        // Message embeds
        db.run(`
          CREATE TABLE IF NOT EXISTS message_embeds (
            id TEXT PRIMARY KEY,
            message_id TEXT NOT NULL,
            title TEXT,
            description TEXT,
            url TEXT,
            color INTEGER,
            image_url TEXT,
            thumbnail_url TEXT,
            author_name TEXT,
            footer_text TEXT,
            FOREIGN KEY (message_id) REFERENCES messages(id)
          )
        `);

        // Attachments
        db.run(`
          CREATE TABLE IF NOT EXISTS attachments (
            id TEXT PRIMARY KEY,
            message_id TEXT,
            filename TEXT NOT NULL,
            size INTEGER NOT NULL,
            url TEXT NOT NULL,
            content_type TEXT,
            width INTEGER,
            height INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (message_id) REFERENCES messages(id)
          )
        `);

        // Message threads
        db.run(`
          CREATE TABLE IF NOT EXISTS message_threads (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            message_id TEXT NOT NULL,
            channel_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (message_id) REFERENCES messages(id),
            FOREIGN KEY (channel_id) REFERENCES channels(id)
          )
        `);

        // Direct messages
        db.run(`
          CREATE TABLE IF NOT EXISTS direct_messages (
            id TEXT PRIMARY KEY,
            content TEXT,
            sender_id TEXT NOT NULL,
            sender_name TEXT NOT NULL,
            sender_avatar TEXT,
            recipient_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            edited_at DATETIME,
            FOREIGN KEY (sender_id) REFERENCES users(id),
            FOREIGN KEY (recipient_id) REFERENCES users(id)
          )
        `);

        // DM reactions
        db.run(`
          CREATE TABLE IF NOT EXISTS dm_reactions (
            id TEXT PRIMARY KEY,
            dm_id TEXT NOT NULL,
            emoji TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (dm_id) REFERENCES direct_messages(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(dm_id, emoji, user_id)
          )
        `);

        // Invites
        db.run(`
          CREATE TABLE IF NOT EXISTS invites (
            code TEXT PRIMARY KEY,
            server_id TEXT NOT NULL,
            created_by TEXT NOT NULL,
            expires_at DATETIME,
            max_uses INTEGER,
            uses INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (server_id) REFERENCES servers(id),
            FOREIGN KEY (created_by) REFERENCES users(id)
          )
        `);

        // Bans
        db.run(`
          CREATE TABLE IF NOT EXISTS bans (
            id TEXT PRIMARY KEY,
            server_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            reason TEXT,
            banned_by TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (server_id) REFERENCES servers(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (banned_by) REFERENCES users(id),
            UNIQUE(server_id, user_id)
          )
        `);

        // Webhooks
        db.run(`
          CREATE TABLE IF NOT EXISTS webhooks (
            id TEXT PRIMARY KEY,
            channel_id TEXT NOT NULL,
            name TEXT NOT NULL,
            token TEXT NOT NULL,
            avatar TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (channel_id) REFERENCES channels(id)
          )
        `, (err: Error | null) => {
          if (err) {
            reject(err);
          } else {
            console.log('📦 Database initialized with full schema');
            resolve();
          }
        });
      });
    });
  });
}

