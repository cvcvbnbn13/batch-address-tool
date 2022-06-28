import React, { useState } from 'react';
import { useBatchTool } from '../../context/toolProvider';
import './index.css';

const MainPage = () => {
  const { handleInput, contract, inputValue } = useBatchTool();

  const tranfer = async () => {
    // if (!inputValue.NFTAddress) {
    //   alert('Please fill in contract address for ERC-721 token contract.');
    //   return;
    // } else if (!inputValue.Network) {
    //   alert('Please pick a network.');
    //   return;
    // }

    if (contract) {
      console.log(contract);
    }
  };

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

  return (
    <div className="mainPage">
      <h2>Batch Tranfer</h2>

      <label htmlFor="NFTAddress">NFTContract Address</label>
      <input
        type="text"
        id="NFTAddress"
        name="NFTAddress"
        onChange={handleInput}
        value={inputValue.NFTAddress}
      />
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
      <label htmlFor="Recipient">Recipient</label>
      <input
        type="text"
        name="Recipient"
        id="Recipient"
        value={inputValue.Recipient}
        onChange={handleInput}
      />
      <label htmlFor="TokenIDs">
        Token IDs (one per line, in decimal numbers)
      </label>
      <input
        type="text"
        name="TokenIDs"
        id="TokenIDs"
        value={inputValue.TokenIDs}
        onChange={handleInput}
      />

      <button>Approve Contract</button>
      <button onClick={tranfer}>Tranfer</button>
    </div>
  );
};

export default MainPage;
