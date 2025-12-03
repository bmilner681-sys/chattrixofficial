import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { ServerBrowser } from './components/ServerBrowser';
import { UserProfile } from './components/UserProfile';
import { connectSocket, disconnectSocket, socket } from './socket';
import './App.css';

interface Channel {
  id: string;
  name: string;
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | undefined>();
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([
    { id: 'general', name: 'general' },
    { id: 'random', name: 'random' },
    { id: 'dev', name: 'dev' },
    { id: 'gaming', name: 'gaming' },
  ]);
  const [showServerBrowser, setShowServerBrowser] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userStatus, setUserStatus] = useState<'online' | 'idle' | 'dnd' | 'offline'>('online');

  useEffect(() => {
    if (token && userId && username) {
      connectSocket(userId, username);
      
      // Set user as online
      socket.emit('presence:update', {
        userId,
        username,
        status: 'online',
      });
    }

    return () => {
      if (token) {
        disconnectSocket();
      }
    };
  }, [token, userId, username]);

  // Set default channel on mount
  useEffect(() => {
    if (channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0].id);
    }
  }, [channels, selectedChannelId]);

  const handleAuthSuccess = (newToken: string, newUserId: string, newUsername: string) => {
    setToken(newToken);
    setUserId(newUserId);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    if (userId) {
      socket.emit('presence:update', {
        userId,
        username,
        status: 'offline',
      });
    }
    setToken(null);
    setUserId(null);
    setUsername(null);
    setSelectedChannelId(null);
    localStorage.removeItem('token');
    disconnectSocket();
  };

  const handleStatusChange = (status: 'online' | 'idle' | 'dnd' | 'offline') => {
    setUserStatus(status);
    if (userId && username) {
      socket.emit('presence:update', {
        userId,
        username,
        status,
      });
    }
  };

  if (!token || !userId || !username) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app">
      <Sidebar
        currentUser={username}
        channels={channels}
        selectedChannelId={selectedChannelId}
        onChannelSelect={setSelectedChannelId}
        onServerBrowser={() => setShowServerBrowser(true)}
        onUserProfile={() => setShowUserProfile(true)}
        userStatus={userStatus}
        onStatusChange={handleStatusChange}
        onLogout={handleLogout}
      />
      {selectedChannelId && (
        <ChatWindow
          channelId={selectedChannelId}
          channelName={
            channels.find((c) => c.id === selectedChannelId)?.name || 'Unknown'
          }
          userId={userId}
          username={username}
          userAvatar={userAvatar}
        />
      )}
      {showServerBrowser && (
        <ServerBrowser
          userId={userId}
          onServerSelect={(serverId) => {
            setSelectedChannelId(`server_${serverId}`);
            setShowServerBrowser(false);
          }}
          onClose={() => setShowServerBrowser(false)}
        />
      )}
      {showUserProfile && (
        <UserProfile
          userId={userId}
          username={username}
          avatar={userAvatar}
          status={userStatus}
          statusMessage="Using Chattrix ✨"
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
}

export default App;
