import { createContext, useContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import reducer from './reducer';

import {
  INIT_BATCH_TOOL,
  HANDLE_INPUT_TOOL,
  GET_APPROVE_BEGIN,
  GET_APPROVE_END,
  TRANSFER_BEGIN,
  TRANSFER_END,
  CHECK_IS_APPROVED,
  GET_CURRENT_USER,
  INIT_IS_APPROVED,
  LOG_OUT,
  GET_CSV_TOKENIDS,
  GET_NFT_ADDRESS_TOKENIDS,
} from './actions';

import { ethers } from 'ethers';
import { getBatchTransferContract, getERC721Contract } from '../utils';

const provider = ethers.getDefaultProvider('rinkeby', {
  infura: {
    projectId: process.env.INFURA_PROJECT_ID,
    projectSecret: process.env.INFURA_PROJECT_SECRET,
  },
});

const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

const initialState = {
  ethereum: null,
  provider,
  BatchTransferContract: null,
  ERC721Contract: null,
  isLoading: false,
  isApproved: null,
  currentUser: '',
  csvTokenIDs: null,
  NFTAddressTokenIDs: null,
  inputValue: {
    NFTAddress: '',
    Network: '',
    TokenIDs: '',
    Recipient: '',
  },
};

const ToolContext = createContext();

const ToolProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function initTool() {
      try {
        await web3Provider.send('eth_requestAccounts', []);
        const signer = web3Provider.getSigner();

        const contract = await getBatchTransferContract(provider);
        const ERC721Contract = await getERC721Contract(
          state.inputValue.NFTAddress,
          provider
        );

        const signedContract = contract.connect(signer);
        const signedERC721Contract = ERC721Contract.connect(signer);

        dispatch({
          type: INIT_BATCH_TOOL,
          payload: { signedContract, signedERC721Contract },
        });
      } catch (error) {
        console.error(error);
      }
    }
    initTool();
  }, [state.inputValue.NFTAddress, state.ethereum?.selectedAddress]);

  useEffect(() => {
    async function checkIsApproved() {
      try {
        if (state.inputValue?.NFTAddress !== '') {
          const isApproved = await state.ERC721Contract?.isApprovedForAll(
            state.currentUser,
            state.BatchTransferContract?.address
          );
          dispatch({ type: CHECK_IS_APPROVED, payload: isApproved });
        }
        if (!state.inputValue?.NFTAddress) {
          dispatch({ type: INIT_IS_APPROVED });
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (
      state.inputValue.NFTAddress !== '' &&
      state.ERC721Contract?.address === state.inputValue.NFTAddress
    ) {
      checkIsApproved();
    }
  }, [
    state.ERC721Contract,
    state.currentUser,
    state.BatchTransferContract,
    state.inputValue.NFTAddress,
    state.isApproved,
  ]);

  useEffect(() => {
    if (state.ethereum) {
      state.ethereum?.on('accountsChanged', handleAccountsChanged);
      return () => {
        state.ethereum?.removeListener(
          'accountsChanged',
          handleAccountsChanged
        );
      };
    }
  });

  useEffect(() => {
    const getNFTAddressTokenIDs = async () => {
      if (state.ERC721Contract) {
        const hex = await state.ERC721Contract.totalSupply();
        const totalSupply = parseInt(hex, 10);
        const tokenIDs = [];

        for (let i = 0; i < totalSupply; i++) {
          const hex = await state.ERC721Contract.tokenOfOwnerByIndex(
            state.currentUser,
            i
          );
          const tokenID = parseInt(hex, 10);
          tokenIDs.push(tokenID);
        }

        dispatch({ type: GET_NFT_ADDRESS_TOKENIDS, payload: { tokenIDs } });
      }
    };

    if (
      state.inputValue.NFTAddress !== '' &&
      state.inputValue.NFTAddress === state.ERC721Contract?.address
    ) {
      getNFTAddressTokenIDs();
    }
  }, [
    state.inputValue.NFTAddress,
    state.ERC721Contract?.address,
    state.currentUser,
    state.ERC721Contract,
  ]);

  const handleAccountsChanged = (...arg) => {
    const accounts = arg[0];
    if (accounts.length > 0) {
      dispatch({ type: GET_CURRENT_USER, payload: { accounts } });
    }
  };

  const logout = async () => {
    const accounts = await state.ethereum
      .request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
      .then(() =>
        state.ethereum.request({
          method: 'eth_requestAccounts',
        })
      );

    const account = accounts[0];
    dispatch({ type: LOG_OUT, payload: account });
  };

  const handleInput = e => {
    dispatch({
      type: HANDLE_INPUT_TOOL,
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const approveContract = async () => {
    if (!state.inputValue.NFTAddress) {
      alert('Please fill in contract address for ERC-721 token contract.');
      return;
    } else if (!state.inputValue.Network) {
      alert('Please pick a network.');
      return;
    }

    if (!state.ethereum || state.ethereum?.selectedAddress === null) {
      alert('Please connect your wall first');
      return;
    }

    try {
      dispatch({
        type: GET_APPROVE_BEGIN,
      });
      if (state.ERC721Contract && state.BatchTransferContract) {
        const tx = await state.ERC721Contract.setApprovalForAll(
          state.BatchTransferContract.address,
          true
        );

        await toast.promise(tx.wait(), {
          pending: 'Approving...',
          success: 'Approve successfully',
          error: 'Approve unsuccessfully',
        });
      }
      dispatch({
        type: GET_APPROVE_END,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: GET_APPROVE_END,
      });
    }
  };

  const transfer = async () => {
    if (!state.ethereum || state.ethereum?.selectedAddress === null) {
      alert('Please connect your wall first');
      return;
    }

    if (!state.inputValue.NFTAddress) {
      alert('Please fill in contract address for ERC-721 token contract.');
      return;
    } else if (!state.inputValue.Network) {
      alert('Please pick a network.');
      return;
    } else if (!state.inputValue.Recipient) {
      alert('Please fill in recipient address');
      return;
    }

    if (!state.isApproved) {
      alert('Please approve your contract first');
      return;
    }

    try {
      if (state.BatchTransferContract) {
        dispatch({ type: TRANSFER_BEGIN });
        const tokenIDs = state.inputValue.TokenIDs.split('\n').map(item =>
          parseInt(item)
        );

        const tx = await state.BatchTransferContract.batchTransfer(
          state.inputValue.NFTAddress,
          state.inputValue.Recipient,
          tokenIDs
        );

        await toast.promise(tx.wait(), {
          pending: 'Transfering...',
          success: 'Transfer successfully',
          error: 'Transfer unsuccessfully',
        });
      }
      dispatch({ type: TRANSFER_END });
      window.location.reload();
    } catch (error) {
      console.error(error);
      dispatch({ type: TRANSFER_END });
    }
  };

  const getCSVTokenIDs = async csvTokenIDs => {
    try {
      await dispatch({ type: GET_CSV_TOKENIDS, payload: { csvTokenIDs } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ToolContext.Provider
      value={{
        ...state,
        handleInput,
        approveContract,
        transfer,
        logout,
        getCSVTokenIDs,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
};

function useBatchTool() {
  return useContext(ToolContext);
}

export { initialState, useBatchTool };

export default ToolProvider;
