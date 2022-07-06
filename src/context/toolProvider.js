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
  LOG_OUT,
  GET_CSV_TOKENIDS,
  REMOVE_CSV_TOKENIDS,
  GET_NFT_ADDRESS_TOKENIDS,
  GET_NFT_LIST_BEGIN,
  GET_NFT_LIST_END,
  LIST_BULKS_TOKENIDS,
  REMOVE_BULKS_TOKENIDS,
  CONNECT,
  DECONSTRUCT_CSV,
  DENY_TRANSFER,
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
  isTransfering: false,
  currentUser: '',
  csvTokenIDs: null,
  NFTAddressTokenIDsOfOwner: [],
  NFTList: [],
  isConnected: true,
  multipleTransferationList: [],
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

  console.log(state.inputValue.TokenIDs);
  useEffect(() => {
    if (!state.isConnected) return;

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
  }, [
    state.inputValue.NFTAddress,
    state.ethereum?.selectedAddress,
    state.isConnected,
  ]);

  useEffect(() => {
    if (!state.isConnected) return;

    async function checkIsApproved() {
      try {
        const isApproved = await state.ERC721Contract?.isApprovedForAll(
          state.currentUser,
          state.BatchTransferContract?.address
        );
        dispatch({ type: CHECK_IS_APPROVED, payload: isApproved });
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
    state.isConnected,
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
  }, [state.ethereum]);

  const handleAccountsChanged = (...arg) => {
    const accounts = arg[0];
    if (accounts.length > 0) {
      dispatch({ type: GET_CURRENT_USER, payload: { accounts } });
    }
  };

  useEffect(() => {
    const getNFTAddressTokenIDsOfOwner = async () => {
      try {
        if (state.ERC721Contract) {
          const hex = await state.ERC721Contract.balanceOf(state.currentUser);
          const balanceOf = parseInt(hex, 10);

          const tokenIDs = [];
          for (let i = 0; i < balanceOf; i++) {
            const hex = await state.ERC721Contract.tokenOfOwnerByIndex(
              state.currentUser,
              i
            );

            const tokenID = parseInt(hex, 10);
            tokenIDs.push(tokenID);
          }

          dispatch({
            type: GET_NFT_ADDRESS_TOKENIDS,
            payload: { tokenIDs: tokenIDs },
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (
      state.inputValue.NFTAddress !== '' &&
      state.inputValue.NFTAddress === state.ERC721Contract?.address
    ) {
      getNFTAddressTokenIDsOfOwner();
    }
  }, [
    state.inputValue.NFTAddress,
    state.ERC721Contract?.address,
    state.currentUser,
    state.ERC721Contract,
  ]);

  useEffect(() => {
    const getNFTList = async () => {
      try {
        const nftList = [];
        dispatch({ type: GET_NFT_LIST_BEGIN });
        for (let i = 0; i < state.NFTAddressTokenIDsOfOwner.length; i++) {
          const tokenURI = await state.ERC721Contract?.tokenURI(
            state.NFTAddressTokenIDsOfOwner[i]
          );
          const tokenURIFormat = tokenURI.replace('ipfs://', 'ipfs/');

          const res = await fetch(`https://ipfs.io/${tokenURIFormat}`);

          const { image, name } = await res.json();
          const imageFormat = image.replace('ipfs://', 'ipfs/');

          nftList.push({
            tokenID: state.NFTAddressTokenIDsOfOwner[i],
            name,
            image: `https://gateway.thirdweb.dev/${imageFormat}`,
          });
        }

        dispatch({ type: GET_NFT_LIST_END, payload: { nftList } });
      } catch (error) {
        console.error(error);
      }
    };

    if (
      state.inputValue.NFTAddress !== '' &&
      state.inputValue.NFTAddress === state.ERC721Contract?.address
    ) {
      getNFTList();
    }

    return () => {
      getNFTList();
    };
  }, [
    state.ERC721Contract,
    state.NFTAddressTokenIDsOfOwner,
    state.inputValue.NFTAddress,
  ]);

  useEffect(() => {
    const deconstructCsv = async () => {
      const multipleTransferationList = [];

      try {
        if (state.csvTokenIDs !== null) {
          for (let i = 1; i < state.csvTokenIDs.length; i++) {
            if (!state.csvTokenIDs[i][0] || !state.csvTokenIDs[i][1]) continue;
            multipleTransferationList[i - 1] = {
              Recipient: state.csvTokenIDs[i][0],
              TokenIDs: [state.csvTokenIDs[i][1]],
            };
          }

          dispatch({
            type: DECONSTRUCT_CSV,
            payload: { multipleTransferationList },
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    deconstructCsv();
  }, [state.csvTokenIDs]);

  const connect = async () => {
    try {
      await state.ethereum?.request({ method: 'eth_requestAccounts' });
      dispatch({ type: CONNECT });
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    dispatch({ type: LOG_OUT });
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

    if (
      !state.ethereum ||
      state.ethereum?.selectedAddress === null ||
      !state.isConnected
    ) {
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
    if (
      !state.ethereum ||
      state.ethereum?.selectedAddress === null ||
      !state.isConnected
    ) {
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

        if (state.multipleTransferationList.length > 0) {
          for (let i = 0; i < state.multipleTransferationList.length; i++) {
            const tokenIDs = state.multipleTransferationList[i].TokenIDs.map(
              item => parseInt(item)
            );

            const tx = await state.BatchTransferContract.batchTransfer(
              state.inputValue.NFTAddress,
              state.multipleTransferationList[i].Recipient,
              tokenIDs
            );

            await toast.promise(tx.wait(), {
              pending: 'Transfering...',
              success: 'Transfer successfully',
              error: 'Transfer unsuccessfully',
            });
          }
        } else {
          const tokenIDs = state.inputValue.TokenIDs.toString()
            .split('\n')
            .map(item => parseInt(item));

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
      }
      dispatch({ type: TRANSFER_END });
    } catch (error) {
      dispatch({ type: DENY_TRANSFER });
      console.error(error);
    }
  };

  const getCSVTokenIDs = async csvTokenIDs => {
    try {
      await dispatch({ type: GET_CSV_TOKENIDS, payload: { csvTokenIDs } });
    } catch (error) {
      console.error(error);
    }
  };

  const removeCSVTokenIDs = async e => {
    try {
      await dispatch({ type: REMOVE_CSV_TOKENIDS });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulksChange = e => {
    if (e.target.checked === true) {
      dispatch({
        type: LIST_BULKS_TOKENIDS,
        payload: {
          tokenIDsArray: e.target.value,
        },
      });
    } else if (e.target.checked === false) {
      let regStr = new RegExp(
        `${e.target.value}\n*|\n*${e.target.value}| \n.`,
        'g'
      );
      const tokenIDsArray = Array.from(state.inputValue.TokenIDs)
        .join('')
        .replace(regStr, '');
      dispatch({ type: REMOVE_BULKS_TOKENIDS, payload: { tokenIDsArray } });
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
        handleBulksChange,
        connect,
        removeCSVTokenIDs,
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
