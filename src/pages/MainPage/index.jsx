import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import { InputSection, Loading, WalletButtonMenu } from '../../components';
import './index.css';

const MainPage = () => {
  const {
    approveContract,
    transfer,
    isLoading,
    isTransfering,
    isApproving,
    isApproved,
    inputValue,
  } = useBatchTool();

  return (
    <div className="mainPage">
      <div className="banner">
        <h2>Batch Transfer</h2>
        <WalletButtonMenu />
      </div>
      <InputSection />

      <button onClick={approveContract} disabled={isApproving || isApproved}>
        {isApproved ? (
          'Contract was approved'
        ) : !isApproved && isApproving ? (
          <Loading />
        ) : (
          'Approve Contract'
        )}
      </button>
      <button onClick={transfer} disabled={isTransfering || !isApproved}>
        {isTransfering ? <Loading /> : 'Transfer'}
      </button>
    </div>
  );
};

export default MainPage;
