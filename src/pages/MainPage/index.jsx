import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import { InputSection, Loading, WalletButtonMenu } from '../../components';
import './index.css';

const MainPage = () => {
  const { approveContract, transfer, isLoading, isApproved, inputValue } =
    useBatchTool();

  const { TokenIDs } = inputValue;

  return (
    <div className="mainPage">
      <div className="banner">
        <h2>Batch Transfer</h2>
        <WalletButtonMenu />
      </div>
      <InputSection />

      <button onClick={approveContract} disabled={isLoading || isApproved}>
        {isApproved ? (
          'Contract was approved'
        ) : !isApproved && isLoading ? (
          <Loading />
        ) : (
          'Approve Contract'
        )}
      </button>
      <button onClick={transfer} disabled={isLoading || !isApproved}>
        {isApproved && isLoading && TokenIDs !== '' ? <Loading /> : 'Transfer'}
      </button>
    </div>
  );
};

export default MainPage;
