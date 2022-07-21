import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import Loading from '../Loading';
import './index.css';

const ExhibitNFTListSection = () => {
  const {
    NFTList,
    NFTAddressTokenIDsOfOwner,
    isLoading,
    isTransfering,
    isApproving,
    isUnlocked,
    inputValue,
    ContractValidatePart,
  } = useBatchTool();

  const { addrIsContract } = ContractValidatePart;

  return isLoading &&
    !isTransfering &&
    !isApproving &&
    inputValue.NFTAddress !== '' &&
    addrIsContract !== false ? (
    <Loading />
  ) : (
    <section
      className={
        NFTAddressTokenIDsOfOwner.length > 0 &&
        NFTList.length > 0 &&
        inputValue.NFTAddress !== '' &&
        isUnlocked
          ? 'nftList-section'
          : ''
      }
    >
      {NFTAddressTokenIDsOfOwner.length > 0 &&
      inputValue.NFTAddress !== '' &&
      NFTList.length > 0 &&
      isUnlocked ? (
        <div className="nft-list">
          <div className="nft-container">
            {NFTList.map(item => {
              return (
                <div className="nft-item" key={item.name}>
                  <img src={item.image} alt={item.name} />
                  <p>{`${item.tokenID} | ${item.name}`}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ExhibitNFTListSection;
