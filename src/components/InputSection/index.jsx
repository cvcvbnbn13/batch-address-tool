import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import CSVReader from '../CSVReader';
import './index.css';

const networkOption = [
  {
    title: 'Pick a network',
    value: '',
  },
  {
    title: 'Ethereum Rinkeby test network',
    value: 'rinkeby',
  },
];

const InputSection = () => {
  const { inputValue, handleInput } = useBatchTool();
  return (
    <div className="input-section">
      <label htmlFor="Network">Network</label>
      <select
        name="Network"
        id="Network"
        value={inputValue.Network}
        onChange={handleInput}
      >
        {networkOption.map(item => {
          return (
            <option value={item.value} key={item.title}>
              {item.title}
            </option>
          );
        })}
      </select>
      <label htmlFor="NFTAddress">NFTContract Address</label>
      <input
        type="text"
        id="NFTAddress"
        name="NFTAddress"
        onChange={handleInput}
        value={inputValue.NFTAddress}
      />
      <label htmlFor="Recipient">Recipient</label>
      <input
        type="text"
        name="Recipient"
        id="Recipient"
        value={inputValue.Recipient}
        onChange={handleInput}
      />

      <CSVReader />

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
