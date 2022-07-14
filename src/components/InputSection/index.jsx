import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import './index.css';

const chainId = {
  '0x4': 'Rinkeby',
};

const InputSection = () => {
  const { inputValue, handleInput, multipleTransferationList, ethereum } =
    useBatchTool();
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
      <input
        type="text"
        id="NFTAddress"
        name="NFTAddress"
        onChange={handleInput}
        value={inputValue.NFTAddress}
      />
      <label htmlFor="Recipient">Recipient</label>
      {multipleTransferationList.length > 0 ? (
        <textarea
          name="Recipient"
          id="Recipient"
          value={inputValue.Recipient}
          onChange={handleInput}
          rows="5"
          cols="30"
        />
      ) : (
        <input
          type="text"
          name="Recipient"
          id="Recipient"
          value={inputValue.Recipient}
          onChange={handleInput}
        />
      )}

      <label htmlFor="TokenIDs">
        Token IDs (one per line, in decimal numbers)
      </label>
      <textarea
        name="TokenIDs"
        id="TokenIDs"
        value={inputValue.TokenIDs}
        onChange={handleInput}
        rows="5"
        cols="30"
      />
    </div>
  );
};

export default InputSection;
