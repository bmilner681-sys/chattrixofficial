import React, { useState } from 'react';
import './UserProfile.css';

interface UserProfileProps {
  userId: string;
  username: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  status: string;
  statusMessage?: string;
  onClose: () => void;
}

export function UserProfile({
  userId,
  username,
  avatar,
  banner,
  bio,
  status,
  statusMessage,
  onClose,
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ bio, statusMessage });

  const handleSave = () => {
    setIsEditing(false);
  };

  const statusColors: Record<string, string> = {
    online: '#43b581',
    idle: '#faa61a',
    dnd: '#f04747',
    offline: '#747f8d',
  };

  return (
    <div className="user-profile-modal">
      <div className="profile-card">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {banner && (
          <div className="profile-banner" style={{ backgroundImage: `url(${banner})` }} />
        )}

        <div className="profile-content">
          <div className="profile-header">
            <div className="avatar-section">
              <div className="profile-avatar">{username.charAt(0).toUpperCase()}</div>
              <div
                className="status-indicator"
                style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
              />
            </div>
          </div>

          <h2>{username}</h2>
          <div className="status-text">
            <span className="status-label">{status.toUpperCase()}</span>
            {statusMessage && <p className="status-message">{statusMessage}</p>}
          </div>

          {isEditing ? (
            <div className="edit-form">
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Bio"
              />
              <input
                type="text"
                value={editData.statusMessage}
                onChange={(e) => setEditData({ ...editData, statusMessage: e.target.value })}
                placeholder="Status message"
              />
              <div className="form-buttons">
                <button onClick={handleSave} className="btn-primary">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {bio && (
                <div className="bio-section">
                  <h3>About Me</h3>
                  <p>{bio}</p>
                </div>
              )}
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
