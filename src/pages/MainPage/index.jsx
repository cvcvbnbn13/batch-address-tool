import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import {
  InputSection,
  Loading,
  WalletButtonMenu,
  CSVReader,
  NFTListSection,
} from '../../components';
import './index.css';

const MainPage = () => {
  const {
    approveContract,
    transfer,
    isTransfering,
    isApproving,
    isApproved,
    fetchNFTData,
    NFTAddressTokenIDsOfOwner,
    mtList721,
    inputValue,
    ContractValidatePart,
  } = useBatchTool();

  const { addrIsContract, ERC1155Check } = ContractValidatePart;

  return (
    <div className="mainPage">
      <div className="banner">
        <h2>Batch Transfer</h2>
        <WalletButtonMenu />
      </div>
      <div className="mainpage-input-container">
        <InputSection />
        <div className="csvreader-container">
          <label>Upload CSV</label>
          <br />
          <p>
            You can{' '}
            {ERC1155Check ? (
              <a href="./1155Contract-example.csv" download>
                download csv example here.
              </a>
            ) : (
              <a href="./721Contract-example.csv" download>
                download csv example here.
              </a>
            )}{' '}
            please make sure you recpient address are correct.
          </p>
          <CSVReader />
        </div>
      </div>
      <div className="mainpage-button-container">
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
      {inputValue.NFTAddress !== '' &&
        mtList721.length === 0 &&
        NFTAddressTokenIDsOfOwner.length > 0 &&
        addrIsContract &&
        isApproved && (
          <div className="show-nft">
            <h3 onClick={fetchNFTData}>Click to Fetch My NFT</h3>
            <NFTListSection />
          </div>
        )}
    </div>
  );
};

export default MainPage;
