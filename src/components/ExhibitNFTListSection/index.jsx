import React, { useState, useRef } from 'react';
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

  // showmore implement
  const nftItemRef = useRef(undefined);

  const [addHeight, setAddHeight] = useState(730);

  const handleShowMore = () => {
    const maxHeight =
      Math.ceil(NFTList.length / 4) * nftItemRef.current?.clientHeight;
    if (addHeight === maxHeight) return;
    setAddHeight(state => state + nftItemRef.current?.clientHeight * 2);
  };

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
          <div
            className="nft-container"
            style={{
              height: NFTList.length > 9 && `${addHeight}px`,
            }}
          >
            {NFTList.map(item => {
              return (
                <div className="nft-item" key={item.name} ref={nftItemRef}>
                  <img src={item.image} alt={item.name} />
                  <p>{`${item.tokenID} | ${item.name}`}</p>
                </div>
              );
            })}
          </div>
          {NFTList.length > 8 && (
            <div className="showMore">
              <button onClick={handleShowMore}>Show More</button>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
};

export default ExhibitNFTListSection;
