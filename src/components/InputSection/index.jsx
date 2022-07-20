import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import './index.css';
import { DebounceInput } from 'react-debounce-input';

const InputSection = () => {
  const { inputValue, handleInput, ethereum, ContractValidatePart } =
    useBatchTool();

  const { ERC721Check, ERC1155Check, addrIsContract } = ContractValidatePart;

  return (
    <div className="input-section">
      <div className="network-container">
        <span
          className={ethereum?.chainId === '0x4' ? 'connect' : 'disconnect'}
        >
          Rinkeby
        </span>
      </div>
      <label htmlFor="NFTAddress">NFTContract Address</label>
      <DebounceInput
        type="text"
        id="NFTAddress"
        name="NFTAddress"
        minLength={0}
        debounceTimeout={250}
        onChange={handleInput}
        value={inputValue.NFTAddress}
      />
      <div className="contract-container">
        <span
          className={
            ERC721Check && ERC721Check !== null
              ? 'connect'
              : inputValue.NFTAddress === ''
              ? 'disconnect'
              : 'disconnect'
          }
        >
          ERC721
        </span>
        <span
          className={
            ERC1155Check && ERC1155Check !== null
              ? 'connect'
              : inputValue.NFTAddress === ''
              ? 'disconnect'
              : 'disconnect'
          }
        >
          ERC1155
        </span>
        <span
          className={
            ERC721Check !== null && ERC1155Check !== null
              ? 'disconnect'
              : (ERC1155Check === false && ERC721Check === false) ||
                addrIsContract === false
              ? 'error'
              : inputValue.NFTAddress === ''
              ? 'disconnect'
              : 'disconnect'
          }
        >
          ERROR
        </span>
      </div>

      {ERC1155Check && ERC1155Check !== null ? (
        <>
          <label htmlFor="RecipientandTokenIDs">
            Recipient and TokenID and amount (one per line, one recipient ,one
            tokenID and one amount)
          </label>
          <textarea
            name="RecipientandTokenIDs"
            id="RecipientandTokenIDs"
            value={inputValue.RecipientandTokenIDs}
            onChange={handleInput}
            rows="10"
            cols="30"
            placeholder={`Recipient_address, tokenId, amount
ex: 
0x356e.....36CB2,1212,10
0x356e.....36CB2,1245,20
0x3Dcb.....6137D,453,30
          `}
          />
        </>
      ) : (
        <>
          <label htmlFor="RecipientandTokenIDs">
            Recipient and Token IDs (one per line, one recipient and one
            tokenID)
          </label>
          <textarea
            name="RecipientandTokenIDs"
            id="RecipientandTokenIDs"
            value={inputValue.RecipientandTokenIDs}
            onChange={handleInput}
            rows="10"
            cols="30"
            placeholder={`Recipient_address, tokenId
ex: 
0x356e.....36CB2,1212
0x356e.....36CB2,1245
0x3Dcb.....6137D,453
          `}
          />
        </>
      )}
    </div>
  );
};

export default InputSection;
