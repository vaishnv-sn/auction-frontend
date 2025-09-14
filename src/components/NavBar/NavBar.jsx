import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      backgroundColor: '#282c34',
      color: 'white',
      alignItems: 'center'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        Auction Platform
      </div>
      {user ? (
        <div>
          <span style={{ marginRight: '1rem' }}>Hello, {user.name}</span>
          <button onClick={onLogout} style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#61dafb',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      ) : (
        <div>Please login</div>
      )}
    </nav>
  );
};

export default Navbar;
