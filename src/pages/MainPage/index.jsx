import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import { InputSection, Loading, WalletButtonMenu } from '../../components';
import './index.css';

const MainPage = () => {
  const {
    approveContract,
    transfer,
    isLoading,
    isApproved,
    ERC721Contract,
    inputValue,
    currentUser,
    csvTokenIDs,
    NFTAddressTokenIDs,
  } = useBatchTool();

  console.log(NFTAddressTokenIDs);

  const getTokenIDs = async () => {
    if (ERC721Contract) {
      const hex = await ERC721Contract.totalSupply();
      const totalSupply = parseInt(hex, 10);
      const tokenIDs = [];

      for (let i = 0; i < totalSupply; i++) {
        const hex = await ERC721Contract.tokenOfOwnerByIndex(currentUser, i);
        const tokenID = parseInt(hex, 10);
        tokenIDs.push(tokenID);
      }

      console.log(tokenIDs);
    }
  };

  if (
    inputValue.NFTAddress !== '' &&
    inputValue.NFTAddress === ERC721Contract?.address
  ) {
    getTokenIDs();
  }

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
        ) : isLoading ? (
          <Loading />
        ) : (
          'Approve Contract'
        )}
      </button>
      <button onClick={transfer} disabled={isLoading || !isApproved}>
        {isLoading ? <Loading /> : 'Transfer'}
      </button>
    </div>
  );
};

export default MainPage;
