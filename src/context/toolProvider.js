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
  GET_OWNER,
  INIT_IS_APPROVED,
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
  owner: '',
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

  // useEffect(() => {
  //   if (!state.ethereum?.selectedAddress) return;
  //   if (state.ethereum) {
  //     async function getAccount() {
  //       try {
  //         const accounts = await state.ethereum?.request({
  //           method: 'eth_requestAccounts',
  //         });
  //         const account = accounts[0];
  //         dispatch({ type: GET_OWNER, payload: account });
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //     getAccount();
  //   }
  // }, [state.ethereum, state.ethereum?.selectedAddress]);

  useEffect(() => {
    async function checkIsApproved() {
      try {
        if (state.inputValue?.NFTAddress !== '') {
          const isApproved = await state.ERC721Contract?.isApprovedForAll(
            state.owner,
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

    checkIsApproved();
  }, [
    state.ERC721Contract,
    state.owner,
    state.BatchTransferContract,
    state.inputValue.NFTAddress,
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

  const handleAccountsChanged = (...arg) => {
    const accounts = arg[0];
    if (accounts.length > 0) {
      dispatch({ type: GET_OWNER, payload: { accounts } });
    }
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
    if (!state.inputValue.NFTAddress) {
      alert('Please fill in contract address for ERC-721 token contract.');
      return;
    } else if (!state.inputValue.Network) {
      alert('Please pick a network.');
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

  return (
    <ToolContext.Provider
      value={{
        ...state,
        handleInput,
        approveContract,
        transfer,
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
