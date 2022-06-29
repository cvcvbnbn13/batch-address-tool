import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from 'react';

import reducer from './reducer';

import {
  INIT_BATCH_TOOL,
  HANDLE_INPUT_TOOL,
  GET_APPROVE_BEGIN,
  GET_APPROVE_END,
} from './actions';

import { ethers } from 'ethers';
import { getBatchTransferContract } from '../utils/getBatchTransferContract';

const provider = ethers.getDefaultProvider('rinkeby', {
  infura: {
    projectId: process.env.INFURA_PROJECT_ID,
    projectSecret: process.env.INFURA_PROJECT_SECRET,
  },
});

const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

const signer = web3Provider.getSigner();

const initialState = {
  ethereum: null,
  provider,
  contract: null,
  isLoading: false,
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
        const contract = await getBatchTransferContract(provider);
        const signedContract = contract.connect(signer);

        dispatch({ type: INIT_BATCH_TOOL, payload: { signedContract } });
      } catch (error) {
        console.error(error);
      }
    }

    initTool();
  }, []);

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
    dispatch({
      type: GET_APPROVE_BEGIN,
    });
    if (state.contract) {
      await state.contract.setApproveForAll(state.contract.address, true);
    }
    dispatch({
      type: GET_APPROVE_END,
    });
  };

  return (
    <ToolContext.Provider value={{ ...state, handleInput, approveContract }}>
      {children}
    </ToolContext.Provider>
  );
};

function useBatchTool() {
  return useContext(ToolContext);
}

export { initialState, useBatchTool };

export default ToolProvider;
