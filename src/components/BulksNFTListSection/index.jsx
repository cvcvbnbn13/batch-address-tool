import React, { useState, useRef } from 'react';
import { useBatchTool } from '../../context/toolProvider';
import Loading from '../Loading';
import './index.css';

const BulksNFTListSection = () => {
  const {
    NFTList,
    handleBulksChange,
    importRecipient,
    cleanAllRecipients,
    NFTAddressTokenIDsOfOwner,
    isLoading,
    isTransfering,
    isApproving,
    isUnlocked,
    inputValue,
    ContractValidatePart,
    NFTItemRecipient,
    handleNFTItemInput,
  } = useBatchTool();

  const { addrIsContract } = ContractValidatePart;

  const [manyItemRecipient, setManyItemRecipient] = useState('');

  // showmore implement
  const nftContainerRef = useRef(undefined);
  const nftItemRef = useRef(undefined);
  const itemheight = nftItemRef.current?.clientHeight;

  const [addHeight, setAddHeight] = useState(
    nftContainerRef.current?.clientHeight
  );

  const handleShowMore = () => {
    const maxHeight = Math.ceil(NFTList.length / 4) * itemheight;
    if (nftContainerRef.current?.clientHeight === maxHeight) return;
    setAddHeight(nftContainerRef.current?.clientHeight + itemheight * 2);
  };

  const handleChange = e => {
    setManyItemRecipient(e.target.value);
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
          <div className="nft-list-banner">
            <p>Select NFT to transfer</p>
            <div className="nft-list-banner-input">
              <input
                type="text"
                placeholder="Recipient"
                value={manyItemRecipient}
                onChange={handleChange}
              />
              <button onClick={() => importRecipient(manyItemRecipient)}>
                <img
                  src="https://cdn3.iconfinder.com/data/icons/ilb/Cute%20Ball%20-%20Go.png"
                  alt=""
                />
              </button>
              <button onClick={cleanAllRecipients}>
                <img
                  src="https://cdn3.iconfinder.com/data/icons/user-interface-set-10/128/A-15-128.png"
                  alt=""
                />
              </button>
            </div>
          </div>
          <div
            className="nft-container"
            ref={nftContainerRef}
            style={{ height: `${addHeight}px` }}
          >
            {NFTList.map(item => {
              return (
                <div className="nft-item" key={item.name} ref={nftItemRef}>
                  <label htmlFor={item.name}>
                    <input
                      type="checkbox"
                      id={item.name}
                      value={item.tokenID}
                      className="checkbox"
                      onChange={handleBulksChange}
                      checked={
                        NFTItemRecipient[`${item.tokenID}`]?.checked || ''
                      }
                    />
                    <img src={item.image} alt={item.name} />
                  </label>
                  <p>{`${item.tokenID} | ${item.name}`}</p>
                  <input
                    name={item.tokenID}
                    value={NFTItemRecipient[`${item.tokenID}`]?.recipient || ''}
                    type="text"
                    placeholder="Recipient"
                    className="recipient-input"
                    onChange={handleNFTItemInput}
                  />
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

export default BulksNFTListSection;