export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  statusMessage?: string;
  discriminator: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  serverId: string;
  name: string;
  color: string;
  permissions: bigint;
  position: number;
  mentionable: boolean;
  createdAt: Date;
}

export interface Member {
  id: string;
  userId: string;
  serverId: string;
  nickname?: string;
  roles: string[];
  joinedAt: Date;
  boostedAt?: Date;
}

export interface Channel {
  id: string;
  name: string;
  serverId: string;
  type: 'text' | 'voice' | 'category';
  position: number;
  topic?: string;
  isNsfw: boolean;
  parentId?: string;
  createdAt: Date;
}

export interface Server {
  id: string;
  name: string;
  ownerId: string;
  icon?: string;
  banner?: string;
  description?: string;
  members: string[];
  roles: string[];
  verificationLevel: 0 | 1 | 2 | 3 | 4;
  contentFilterLevel: 0 | 1 | 2;
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  channelId: string;
  serverId?: string;
  pinned: boolean;
  reactions: MessageReaction[];
  embeds: MessageEmbed[];
  attachments: Attachment[];
  createdAt: Date;
  editedAt?: Date;
  deletedAt?: Date;
  thread?: MessageThread;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface MessageEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  image?: { url: string; width?: number; height?: number };
  thumbnail?: { url: string; width?: number; height?: number };
  fields?: { name: string; value: string; inline?: boolean }[];
  author?: { name: string; icon_url?: string; url?: string };
  footer?: { text: string; icon_url?: string };
  timestamp?: Date;
}

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url?: string;
  contentType?: string;
  width?: number;
  height?: number;
}

export interface MessageThread {
  id: string;
  name: string;
  messageId: string;
  createdAt: Date;
}

export interface DirectMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  embeds: MessageEmbed[];
  attachments: Attachment[];
  reactions: MessageReaction[];
  createdAt: Date;
  editedAt?: Date;
}

export interface Invite {
  code: string;
  serverId: string;
  createdBy: string;
  expiresAt?: Date;
  maxUses?: number;
  uses: number;
  createdAt: Date;
}

export interface Ban {
  id: string;
  serverId: string;
  userId: string;
  reason?: string;
  bannedBy: string;
  createdAt: Date;
}

export interface Webhook {
  id: string;
  channelId: string;
  name: string;
  token: string;
  createdAt: Date;
}
