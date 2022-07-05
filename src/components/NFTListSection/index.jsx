import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import './index.css';

const NFTListSection = () => {
  const { NFTList, handleBulksChange, NFTAddressTokenIDsOfOwner } =
    useBatchTool();

  return (
    <section
      className={
        NFTAddressTokenIDsOfOwner.length > 0 && NFTList.length > 0
          ? 'nftList-section'
          : ''
      }
    >
      {NFTAddressTokenIDsOfOwner.length > 0 && NFTList.length > 0 ? (
        <div className="nft-img">
          <p>Select NFT to transfer</p>
          {NFTList.map(item => {
            return (
              <label htmlFor={item.name} key={item.name}>
                <input
                  type="checkbox"
                  id={item.name}
                  value={item.tokenID}
                  className="checkbox"
                  onChange={handleBulksChange}
                />
                <img src={item.image} alt={item.name} />
              </label>
            );
          })}
        </div>
      ) : null}
    </section>
  );
};

export default NFTListSection;
