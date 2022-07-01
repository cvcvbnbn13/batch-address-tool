import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import { InputSection, Loading } from '../../components';
import './index.css';

const MainPage = () => {
  const { approveContract, transfer, isLoading, isApproved, ethereum, owner } =
    useBatchTool();

  const connect = async () => {
    try {
      ethereum?.request({ method: 'eth_requestAccounts' });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mainPage">
      <div className="bar">
        <h2>Batch Transfer</h2>
        {owner ? (
          <button>
            <span>
              {`${ethereum?.selectedAddress.slice(
                0,
                3
              )}...${ethereum?.selectedAddress.slice(-3).toUpperCase()}`}
            </span>
          </button>
        ) : (
          <button onClick={connect}>
            <span>Connect Wallet</span>
          </button>
        )}
      </div>

      <InputSection />

      <button onClick={approveContract} disabled={isLoading || isApproved}>
        {isApproved ? (
          'Contract is Approved'
        ) : isLoading ? (
          <Loading />
        ) : (
          'Approve Contract'
        )}
      </button>
      <button onClick={transfer} disabled={isLoading}>
        {isLoading ? <Loading /> : 'Transfer'}
      </button>
    </div>
  );
};

export default MainPage;
