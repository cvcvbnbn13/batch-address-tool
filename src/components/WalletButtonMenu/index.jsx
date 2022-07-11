import React, { useState } from 'react';
import './index.css';
import { useBatchTool } from '../../context/toolProvider';

const WalletButtonMenu = () => {
  const { currentUser, logout, isConnected, connect, isUnlocked } =
    useBatchTool();
  const [showToggle, setShowToggle] = useState(false);
  const handleShowToggle = () => {
    setShowToggle(!showToggle);
  };

  return (
    <div className="walletButton">
      {currentUser && isConnected && isUnlocked ? (
        <>
          <button onClick={handleShowToggle}>
            <span>
              Connected{' '}
              {`${currentUser.slice(0, 5)}...${currentUser
                .slice(-5)
                .toUpperCase()}`}
            </span>
          </button>
          <div
            className={
              showToggle || !currentUser ? 'showToggle' : 'disableToggle'
            }
          >
            <button
              onClick={function (event) {
                logout();
                handleShowToggle();
              }}
            >
              Disconnect
            </button>
          </div>
        </>
      ) : (
        <button onClick={connect}>
          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );
};

export default WalletButtonMenu;
