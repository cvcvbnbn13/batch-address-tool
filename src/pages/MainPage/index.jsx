import React, { useState } from 'react';
import { useBatchTool } from '../../context/toolProvider';
import { InputSection } from '../../components';
import './index.css';

const MainPage = () => {
  const { contract, inputValue, ethereum } = useBatchTool();

  const getAccount = async () => {
    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];
      return account;
    } catch (error) {
      console.error(error);
    }
  };

  const approveContract = async () => {
    if (!inputValue.NFTAddress) {
      alert('Please fill in contract address for ERC-721 token contract.');
      return;
    } else if (!inputValue.Network) {
      alert('Please pick a network.');
      return;
    }
    try {
      if (contract) {
        contract.setApproveForAll(contract.address, true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const tranfer = async () => {
    if (!inputValue.NFTAddress) {
      alert('Please fill in contract address for ERC-721 token contract.');
      return;
    } else if (!inputValue.Network) {
      alert('Please pick a network.');
      return;
    }

    try {
      const owner = await getAccount();

      if (contract) {
        console.log(contract);
        const isApproved = await contract.isApprovedForAll(
          owner,
          contract.address
        );

        if (!isApproved) {
          alert('Please get the authorize first');
          return;
        }

        const tokenIDs = inputValue.TokenIDs.split('\n').map(item =>
          parseInt(item)
        );

        contract.batchTransfer(owner, inputValue.Recipient, tokenIDs);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="mainPage">
      <h2>Batch Tranfer</h2>

      <InputSection />

      <button onClick={approveContract}>Approve Contract</button>
      <button onClick={tranfer}>Tranfer</button>
    </div>
  );
};

export default MainPage;
