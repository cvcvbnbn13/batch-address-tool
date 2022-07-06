import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import Loading from '../Loading';
import './index.css';

const NFTListSection = () => {
  const {
    NFTList,
    handleBulksChange,
    NFTAddressTokenIDsOfOwner,
    multipleTransferationList,
    isLoading,
    isTransfering,
  } = useBatchTool();

  return isLoading && !isTransfering ? (
    <Loading />
  ) : (
    <section
      className={
        NFTAddressTokenIDsOfOwner.length > 0 && NFTList.length > 0
          ? 'nftList-section'
          : ''
      }
    >
      {multipleTransferationList.length === 0 &&
      NFTAddressTokenIDsOfOwner.length > 0 &&
      NFTList.length > 0 ? (
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
