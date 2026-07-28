import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setUser(userData);
    }
  }, []);

  return (
    <MainLayout>
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>
        
        <div className="profile-content">
          <div className="user-card full-width">
            <div className="user-card-header">
              <div className="user-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h2 className="user-name">{user?.name || 'User Name'}</h2>
            </div>
            
            <div className="user-info">
              <div className="info-item">
                <i className="bi bi-envelope"></i>
                <div className="info-detail">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user?.email || 'email@example.com'}</span>
                </div>
              </div>
              
              <div className="info-item">
                <i className="bi bi-person-badge"></i>
                <div className="info-detail">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              
              
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;