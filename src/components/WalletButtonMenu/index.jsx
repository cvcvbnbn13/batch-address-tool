import React, { useState } from 'react';
import './index.css';
import { useBatchTool } from '../../context/toolProvider';

const WalletButtonMenu = () => {
  const { currentUser, ethereum, logout } = useBatchTool();
  const [showToggle, setShowToggle] = useState(false);

  const connect = async () => {
    try {
      ethereum?.request({ method: 'eth_requestAccounts' });
    } catch (e) {
      console.error(e);
    }
  };

  const disconnect = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.on('accountsChanged', function (accounts) {
        return () =>
          window.ethereum.removeListener('accountsChanged', accounts);
      });
    }
  };

  return (
    <div className="walletButton">
      {currentUser ? (
        <>
          <button onClick={() => setShowToggle(!showToggle)}>
            <span>
              Connected{' '}
              {`${currentUser.slice(0, 3)}...${currentUser
                .slice(-5)
                .toUpperCase()}`}
            </span>
          </button>
          <div
            className={
              showToggle || !currentUser ? 'showToggle' : 'disableToggle'
            }
          >
            <button onClick={disconnect}>Disconnect</button>
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
