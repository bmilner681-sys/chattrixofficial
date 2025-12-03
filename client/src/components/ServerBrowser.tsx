import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import './ServerBrowser.css';

interface ServerBrowserProps {
  userId: string;
  onServerSelect: (serverId: string) => void;
  onClose: () => void;
}

export function ServerBrowser({ userId, onServerSelect, onClose }: ServerBrowserProps) {
  const [servers, setServers] = useState<any[]>([]);
  const [newServerName, setNewServerName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    socket.emit('server:list');

    const handleServerList = (data: any[]) => {
      setServers(data);
    };

    socket.on('server:list-response', handleServerList);

    return () => {
      socket.off('server:list-response', handleServerList);
    };
  }, []);

  const handleCreateServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServerName.trim()) {
      socket.emit('server:create', {
        name: newServerName,
        ownerId: userId,
      });
      setNewServerName('');
      setShowCreateForm(false);
    }
  };

  const handleJoinServer = (serverId: string) => {
    socket.emit('server:join', { serverId, userId });
    onServerSelect(serverId);
  };

  return (
    <div className="server-browser">
      <div className="browser-header">
        <h2>Servers & Communities</h2>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      {showCreateForm ? (
        <form onSubmit={handleCreateServer} className="create-server-form">
          <input
            type="text"
            value={newServerName}
            onChange={(e) => setNewServerName(e.target.value)}
            placeholder="Server name"
            autoFocus
          />
          <button type="submit">Create</button>
          <button type="button" onClick={() => setShowCreateForm(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button
          className="btn-create-server"
          onClick={() => setShowCreateForm(true)}
        >
          + Create Server
        </button>
      )}

      <div className="servers-list">
        {servers.map((server) => (
          <div key={server.id} className="server-item">
            <div className="server-icon">{server.name.charAt(0).toUpperCase()}</div>
            <div className="server-info">
              <h4>{server.name}</h4>
              <p>{server.description || 'No description'}</p>
            </div>
            <button onClick={() => handleJoinServer(server.id)} className="btn-join">
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
