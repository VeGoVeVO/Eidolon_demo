import { useState } from 'react';
import './Header.css';

function Header({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1>Eidolon</h1>
        </div>

        <nav className="header-nav">
          <div className="user-menu">
            <button
              className="user-button"
              onClick={() => setShowMenu(!showMenu)}
              title={user?.name}
            >
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="user-avatar" />
              ) : (
                <div className="user-avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="user-name">{user?.name?.split(' ')[0]}</span>
            </button>

            {showMenu && (
              <div className="dropdown-menu animate-slide-down">
                <div className="menu-header">
                  <p className="menu-email">{user?.email}</p>
                </div>
                <button className="menu-item logout-btn" onClick={onLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

