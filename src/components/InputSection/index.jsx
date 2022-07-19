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
        minLength={1}
        debounceTimeout={250}
        onChange={handleInput}
        value={inputValue.NFTAddress}
      />
      <div className="contract-container">
        <span
          className={
            ERC721Check && ERC721Check !== null ? 'connect' : 'disconnect'
          }
        >
          ERC721
        </span>
        <span
          className={
            ERC1155Check && ERC1155Check !== null ? 'connect' : 'disconnect'
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
              : 'disconnect'
          }
        >
          ERROR
        </span>
      </div>

      <label htmlFor="RecipientandTokenIDs">
        Recipient and Token IDs (one per line, one recipient and one tokenID)
      </label>
      <textarea
        name="RecipientandTokenIDs"
        id="RecipientandTokenIDs"
        value={inputValue.RecipientandTokenIDs}
        onChange={handleInput}
        rows="5"
        cols="30"
        placeholder={`ex: 
0x356eCAeb6629B7A58154B172C4Ace75456e36CB2, 1212
0x356eCAeb6629B7A58154B172C4Ace75456e36CB2, 1245
0x3Dcb476c0501537F8e7B9345335A85756886137D, 453
        `}
      />
    </div>
  );
};

export default InputSection;
