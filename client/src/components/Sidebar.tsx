import React from 'react';
import './Sidebar.css';

interface Channel {
  id: string;
  name: string;
}

interface SidebarProps {
  currentUser: string;
  channels: Channel[];
  selectedChannelId: string | null;
  onChannelSelect: (channelId: string) => void;
  onServerBrowser: () => void;
  onUserProfile: () => void;
  userStatus: 'online' | 'idle' | 'dnd' | 'offline';
  onStatusChange: (status: 'online' | 'idle' | 'dnd' | 'offline') => void;
  onLogout: () => void;
}

export function Sidebar({
  currentUser,
  channels,
  selectedChannelId,
  onChannelSelect,
  onServerBrowser,
  onUserProfile,
  userStatus,
  onStatusChange,
  onLogout,
}: SidebarProps) {
  const statusColors: Record<string, string> = {
    online: '#43b581',
    idle: '#faa61a',
    dnd: '#f04747',
    offline: '#747f8d',
  };

  return (
    <div className="sidebar">
      <div className="server-info">
        <div className="server-name">Chattrix</div>
        <button className="btn-browse-servers" onClick={onServerBrowser} title="Browse Servers">
          +
        </button>
      </div>

      <div className="channels-section">
        <div className="section-title">Channels</div>
        <div className="channels-list">
          {channels.map((channel) => (
            <button
              key={channel.id}
              className={`channel-item ${
                selectedChannelId === channel.id ? 'active' : ''
              }`}
              onClick={() => onChannelSelect(channel.id)}
            >
              #{channel.name}
            </button>
          ))}
        </div>
      </div>

      <div className="user-section">
        <button
          className="user-info"
          onClick={onUserProfile}
          title="View Profile"
        >
          <div className="user-avatar" style={{ position: 'relative' }}>
            <div>{currentUser.charAt(0).toUpperCase()}</div>
            <div
              className="status-dot"
              style={{
                backgroundColor: statusColors[userStatus],
              }}
            />
          </div>
          <div className="user-details">
            <div className="user-name">{currentUser}</div>
            <div className="user-status">{userStatus}</div>
          </div>
        </button>

        <div className="status-selector">
          <button
            className="status-btn"
            style={{ backgroundColor: statusColors['online'] }}
            onClick={() => onStatusChange('online')}
            title="Online"
          />
          <button
            className="status-btn"
            style={{ backgroundColor: statusColors['idle'] }}
            onClick={() => onStatusChange('idle')}
            title="Idle"
          />
          <button
            className="status-btn"
            style={{ backgroundColor: statusColors['dnd'] }}
            onClick={() => onStatusChange('dnd')}
            title="Do Not Disturb"
          />
        </div>

        <button className="logout-btn" onClick={onLogout} title="Logout">
          ⤵️
        </button>
      </div>
    </div>
  );
}
