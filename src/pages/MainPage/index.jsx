import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import {
  InputSection,
  Loading,
  WalletButtonMenu,
  CSVReader,
  BulksNFTListSection,
  ExhibitNFTListSection,
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
    mtList721,
    mtList1155,
    ContractValidatePart,
    isNFTOfOwnerChecking,
  } = useBatchTool();

  console.log(isNFTOfOwnerChecking);

  const { ERC1155Check } = ContractValidatePart;

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

      <div className="show-nft">
        <h3 onClick={fetchNFTData}>
          {isNFTOfOwnerChecking ? 'Loading...' : 'Click to Fetch My NFT'}
        </h3>
        {mtList1155.length > 0 || mtList721.length > 0 ? (
          <ExhibitNFTListSection />
        ) : (
          <BulksNFTListSection />
        )}
      </div>
    </div>
  );
};

export default MainPage;
