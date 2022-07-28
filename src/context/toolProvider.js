import { createContext, useContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import reducer from './reducer';

// const contract = sdk.getEdition('{{contract_address}}');

import {
  INIT_BATCH_TOOL,
  HANDLE_INPUT_TOOL,
  HANDLE_NFTITEM_INPUT_TOOL,
  GET_APPROVE_BEGIN,
  GET_APPROVE_END,
  TRANSFER_BEGIN,
  TRANSFER_END,
  CHECK_IS_APPROVED,
  GET_CURRENT_USER,
  GET_CURRENT_CHAINID,
  LOG_OUT,
  GET_CSV_TOKENIDS,
  REMOVE_CSV_TOKENIDS,
  GET_NFT_ADDRESS_TOKENIDS_BEGIN,
  GET_NFT_ADDRESS_TOKENIDS_END,
  GET_NFT_LIST_BEGIN,
  GET_NFT_LIST_ING,
  GET_NFT_LIST_END,
  LIST_BULKS_TOKENIDS,
  REMOVE_BULKS_TOKENIDS,
  CONNECT,
  DECONSTRUCT_CSV,
  DENY_TRANSFER,
  CHECK_ISUNLOCKED,
  CHECK_ADDR_IS_CONTRACT,
  ADDR_IS_NOT_CONTRACT,
  ERC_721_CHECK,
  ERC_1155_CHECK,
  NFTADDRESS_IS_EMPTY,
  IMPORT_RECIPIENT,
  CLEAN_ALL_NFT_RECIPIENT,
} from './actions';

import { ethers } from 'ethers';
import {
  getBatchTransferContract,
  getERC721Contract,
  getERC1155Contract,
} from '../utils';

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
  ERC1155Contract: null,
  isLoading: false,
  isApproved: null,
  isTransfering: false,
  isApproving: false,
  isUnlocked: false,
  currentUser: '',
  currentChainId: '',
  csvTokenIDs: null,
  ContractValidatePart: {
    addrIsContract: null,
    ERC721Check: null,
    ERC1155Check: null,
  },
  NFTAddressTokenIDsOfOwner: [],
  NFTList: [],
  isConnected: true,
  mtList721: [],
  mtList1155: [],
  inputValue: {
    NFTAddress: '',
    RecipientandTokenIDs: '',
  },
  NFTItemRecipient: {},
  isNFTOfOwnerChecking: false,
  isFetchNFTData: false,
};

const ToolContext = createContext();

const ERC1155IID = '0xd9b67a26';
const ERC721IID = '0x80ac58cd';

const ToolProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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

        const ERC1155Contract = await getERC1155Contract(
          state.inputValue.NFTAddress,
          provider
        );

        const signedContract = contract.connect(signer);
        const signedERC721Contract = ERC721Contract.connect(signer);
        const signedERC1155Contract = ERC1155Contract.connect(signer);

        dispatch({
          type: INIT_BATCH_TOOL,
          payload: {
            signedContract,
            signedERC721Contract,
            signedERC1155Contract,
          },
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
    if (state.inputValue.NFTAddress !== '') return;

    const addressIsEmpty = async () => {
      await dispatch({ type: NFTADDRESS_IS_EMPTY });
    };

    addressIsEmpty();
  }, [state.inputValue.NFTAddress]);

  useEffect(() => {
    if (!state.isConnected) return;

    async function checkIsApproved() {
      try {
        if (state.ContractValidatePart.ERC721Check) {
          const isApproved = await state.ERC721Contract?.isApprovedForAll(
            state.currentUser,
            state.BatchTransferContract?.address
          );
          dispatch({ type: CHECK_IS_APPROVED, payload: isApproved });
        } else if (state.ContractValidatePart.ERC1155Check) {
          const isApproved = await state.ERC1155Contract?.isApprovedForAll(
            state.currentUser,
            state.BatchTransferContract?.address
          );
          dispatch({ type: CHECK_IS_APPROVED, payload: isApproved });
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (
      (state.inputValue.NFTAddress !== '' &&
        state.ERC721Contract?.address === state.inputValue.NFTAddress) ||
      state.ERC1155Contract?.address === state.inputValue.NFTAddress
    ) {
      checkIsApproved();
    }
  }, [
    state.ERC721Contract,
    state.ERC1155Contract,
    state.currentUser,
    state.BatchTransferContract,
    state.inputValue.NFTAddress,
    state.isApproved,
    state.isConnected,
    state.ContractValidatePart.ERC721Check,
    state.ContractValidatePart.ERC1155Check,
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

  useEffect(() => {
    if (state.ethereum) {
      state.ethereum?.on('chainChanged', handleChainChanged);
      return () => {
        state.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [state.ethereum]);

  useEffect(() => {
    if (state.inputValue.NFTAddress === '') return;

    const checkAddrIsContract = async () => {
      try {
        const res = await provider.getCode(state.inputValue.NFTAddress);
        const isContract = res !== '0x';
        dispatch({ type: CHECK_ADDR_IS_CONTRACT, payload: { isContract } });
      } catch (error) {
        dispatch({
          type: ADDR_IS_NOT_CONTRACT,
          payload: { isContract: false },
        });
        console.error(error);
      }
    };

    checkAddrIsContract();
  }, [state.inputValue.NFTAddress]);

  useEffect(() => {
    if (
      state.ERC721Contract === null ||
      state.ERC721Contract?.address === '' ||
      state.ERC721Contract?.address !== state.inputValue.NFTAddress
    )
      return;

    const checkERC721 = async () => {
      try {
        const res = await state.ERC721Contract?.supportsInterface(ERC721IID);

        dispatch({ type: ERC_721_CHECK, payload: { res } });
      } catch (error) {
        console.error(error);
      }
    };

    checkERC721();
  }, [state.ERC721Contract, state.inputValue.NFTAddress]);

  useEffect(() => {
    if (
      state.ERC1155Contract === null ||
      state.ERC1155Contract?.address === '' ||
      state.ERC1155Contract?.address !== state.inputValue.NFTAddress
    )
      return;

    const checkERC1155 = async () => {
      try {
        const res = await state.ERC1155Contract?.supportsInterface(ERC1155IID);
        dispatch({ type: ERC_1155_CHECK, payload: { res } });
      } catch (error) {
        console.error(error);
      }
    };

    checkERC1155();
  }, [state.ERC1155Contract, state.inputValue.NFTAddress]);

  const handleAccountsChanged = (...arg) => {
    const accounts = arg[0];
    if (accounts.length > 0) {
      dispatch({ type: GET_CURRENT_USER, payload: { accounts } });
    } else if (accounts.length <= 0) {
      dispatch({ type: CHECK_ISUNLOCKED, payload: { unlocked: false } });
    }
  };
  const handleChainChanged = (...arg) => {
    const chainId = arg[0];
    if (chainId !== '') {
      dispatch({ type: GET_CURRENT_CHAINID, payload: { chainId } });
    }
  };

  console.log(state.ERC1155Contract);

  useEffect(() => {
    const getERC721TokenIDsOfOwner = async () => {
      if (
        state.inputValue.NFTAddress === '' ||
        state.inputValue.NFTAddress !== state.ERC721Contract?.address ||
        !state.ContractValidatePart.ERC721Check
      )
        return;
      try {
        dispatch({ type: GET_NFT_ADDRESS_TOKENIDS_BEGIN });
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
          type: GET_NFT_ADDRESS_TOKENIDS_END,
          payload: { tokenIDs: tokenIDs },
        });
      } catch (error) {
        console.log(error);
      }
    };

    // const getERC1155TokenIDsOfOwner = async () => {
    //   if (
    //     state.inputValue.NFTAddress === '' ||
    //     state.ERC1155Contract?.address !== state.inputValue.NFTAddress ||
    //     !state.ContractValidatePart.ERC1155Check
    //   )
    //     return;
    //   try {
    //     dispatch({ type: GET_NFT_ADDRESS_TOKENIDS_BEGIN });
    //     const x = await state.ERC1155Contract?.tokensByAccount(
    //       state.currentUser
    //     );
    //     console.log(x);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    getERC721TokenIDsOfOwner();
    // getERC1155TokenIDsOfOwner();
  }, [
    state.inputValue.NFTAddress,
    state.ERC721Contract?.address,
    state.currentUser,
    state.ERC721Contract,
    state.ContractValidatePart.ERC721Check,
    state.ContractValidatePart.ERC1155Check,
    state.ERC1155Contract,
  ]);

  useEffect(() => {
    if (!state.isUnlocked) return;
    if (!state.ContractValidatePart.addrIsContract) return;
    if (
      state.inputValue.NFTAddress === '' ||
      state.inputValue.NFTAddress !== state.ERC721Contract?.address
    )
      return;
    if (!state.isFetchNFTData) return;

    const getNFTList = async () => {
      try {
        const nftList = [];

        state.NFTAddressTokenIDsOfOwner.forEach(async el => {
          const tokenURI = await state.ERC721Contract?.tokenURI(el);
          let regStr = new RegExp('^http', 'g');
          if (regStr.test(tokenURI)) {
            const res = await fetch(tokenURI);

            const { image, name } = await res.json();

            const imageFormat = image.replace('ipfs://', 'ipfs/');

            nftList.push({
              tokenID: el,
              name,
              image: `${imageFormat}`,
            });
          } else {
            const tokenURIFormat = tokenURI.replace('ipfs://', 'ipfs/');

            const res = await fetch(`https://cf-ipfs.com/${tokenURIFormat}`);

            const { image, name } = await res.json();
            const imageFormat = image.replace('ipfs://', 'ipfs/');

            nftList.push({
              tokenID: el,
              name,
              image: `https://cf-ipfs.com/${imageFormat}`,
            });
          }

          await dispatch({ type: GET_NFT_LIST_ING, payload: { nftList } });

          state.NFTItemRecipient[el] = '';
        });

        dispatch({ type: GET_NFT_LIST_END });
      } catch (error) {
        console.error(error);
      }
    };

    getNFTList();

    // return () => {
    //   getNFTList();
    // };
  }, [
    state.isFetchNFTData,
    state.ERC721Contract,
    state.NFTAddressTokenIDsOfOwner,
    state.inputValue.NFTAddress,
    state.isUnlocked,
    state.ContractValidatePart.addrIsContract,
    state.NFTItemRecipient,
  ]);

  useEffect(() => {
    const deconstructCsv = async () => {
      const mtList721 = [];

      const mtList1155 = [];

      if (
        state.ContractValidatePart.ERC721Check ||
        state.ContractValidatePart.ERC721Check === null
      ) {
        try {
          if (state.csvTokenIDs !== null) {
            for (let i = 1; i < state.csvTokenIDs.length; i++) {
              if (!state.csvTokenIDs[i][0] || !state.csvTokenIDs[i][1])
                continue;
              mtList721[i - 1] = {
                Recipient: state.csvTokenIDs[i][0],
                TokenIDs: [state.csvTokenIDs[i][1]],
              };
            }

            dispatch({
              type: DECONSTRUCT_CSV,
              payload: { mtList721 },
            });
          }
        } catch (error) {
          console.error(error);
        }
      } else if (state.ContractValidatePart.ERC1155Check) {
        try {
          if (state.csvTokenIDs !== null) {
            for (let i = 1; i < state.csvTokenIDs.length; i++) {
              if (
                !state.csvTokenIDs[i][0] ||
                !state.csvTokenIDs[i][1] ||
                !state.csvTokenIDs[i][2]
              )
                continue;
              mtList1155[i - 1] = {
                Recipient: state.csvTokenIDs[i][0],
                TokenIDs: [state.csvTokenIDs[i][1]],
                Amounts: [state.csvTokenIDs[i][2]],
              };
            }

            dispatch({
              type: DECONSTRUCT_CSV,
              payload: { mtList1155 },
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    deconstructCsv();
  }, [
    state.csvTokenIDs,
    state.ContractValidatePart.ERC1155Check,
    state.ContractValidatePart.ERC1155Check,
    state.ContractValidatePart,
  ]);

  useEffect(() => {
    const isUnlocked = async () => {
      let unlocked;

      try {
        const accounts = await web3Provider.listAccounts();

        unlocked = accounts.length > 0;
      } catch (e) {
        console.error(e);
      }

      dispatch({ type: CHECK_ISUNLOCKED, payload: { unlocked } });
    };

    isUnlocked();
  }, [state.currentUser, state.ethereum]);

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

  const handleNFTItemInput = e => {
    let regStr = new RegExp(
      `.*,${e.target.name}\n*|\n*.*,${e.target.name}`,
      'g'
    );

    const tokenIDsArray = Array.from(state.inputValue.RecipientandTokenIDs)
      .join('')
      .replace(regStr, '');
    dispatch({
      type: HANDLE_NFTITEM_INPUT_TOOL,
      payload: { name: e.target.name, value: e.target.value, tokenIDsArray },
    });
  };

  const fetchNFTData = () => {
    if (
      !state.ethereum ||
      state.ethereum?.selectedAddress === null ||
      !state.isConnected
    ) {
      alert('Please connect your wall first');
      return;
    }

    if (!state.inputValue.NFTAddress) {
      alert('Please fill in contract address for token contract.');
      return;
    } else if (state.ethereum?.chainId !== '0x4') {
      alert('Please use the Rinkeby chain');
      return;
    }

    if (state.NFTAddressTokenIDsOfOwner.length === 0) {
      alert("Sorry ,You don't have any NFT");
      return;
    }

    dispatch({ type: GET_NFT_LIST_BEGIN });
  };

  const ERC721ApproveContract = async () => {
    try {
      dispatch({
        type: GET_APPROVE_BEGIN,
      });

      const tx = await state.ERC721Contract.setApprovalForAll(
        state.BatchTransferContract.address,
        true
      );

      await toast.promise(tx.wait(), {
        pending: 'Approving...',
        success: 'Approve successfully',
        error: 'Approve unsuccessfully',
      });

      dispatch({
        type: GET_APPROVE_END,
      });

      dispatch({ type: CHECK_IS_APPROVED, payload: true });
    } catch (error) {
      console.error(error);
      dispatch({
        type: GET_APPROVE_END,
      });
    }
  };

  const ERC1155ApproveContract = async () => {
    try {
      dispatch({
        type: GET_APPROVE_BEGIN,
      });
      const tx = await state.ERC1155Contract.setApprovalForAll(
        state.BatchTransferContract.address,
        true
      );

      await toast.promise(tx.wait(), {
        pending: 'Approving...',
        success: 'Approve successfully',
        error: 'Approve unsuccessfully',
      });

      dispatch({
        type: GET_APPROVE_END,
      });

      dispatch({ type: CHECK_IS_APPROVED, payload: true });
    } catch (error) {
      console.error(error);
      dispatch({
        type: GET_APPROVE_END,
      });
    }
  };

  const approveContract = async () => {
    if (!state.inputValue.NFTAddress) {
      alert('Please fill in contract address for token contract.');
      return;
    } else if (state.ethereum?.chainId !== '0x4') {
      alert('Please use the Rinkeby chain');
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

    if (
      state.ERC721Contract &&
      state.BatchTransferContract &&
      state.ContractValidatePart.ERC721Check
    ) {
      await ERC721ApproveContract();
    } else if (
      state.ERC1155Contract &&
      state.BatchTransferContract &&
      state.ContractValidatePart.ERC1155Check
    ) {
      await ERC1155ApproveContract();
    }
  };

  const ERC721transfer = async () => {
    try {
      if (state.BatchTransferContract) {
        dispatch({ type: TRANSFER_BEGIN });

        let recipientList = [];
        let tokenIDList = [];

        if (state.mtList721.length > 0) {
          for (let i = 0; i < state.mtList721.length; i++) {
            const tokenIDs = state.mtList721[i].TokenIDs.join()
              .replace(' ', '')
              .split(',')
              .map(item => parseInt(item));
            if (tokenIDs.length > 0) {
              for (let j = 0; j < tokenIDs.length; j++) {
                recipientList.push(
                  state.mtList721[i].Recipient.replace(' ', '')
                );
                tokenIDList.push(tokenIDs[j]);
              }
            } else {
              recipientList.push([
                state.mtList721[i].Recipient.replace(' ', ''),
              ]);

              tokenIDList.push(state.mtList721[i].TokenIDs[0]);
            }
          }

          const tx = await state.BatchTransferContract.batchTransfer721(
            state.inputValue.NFTAddress,
            recipientList,
            tokenIDList
          );

          await toast.promise(tx.wait(), {
            pending: 'Transfering...',
            success: 'Transfer successfully',
            error: 'Transfer unsuccessfully',
          });
        } else {
          state.inputValue.RecipientandTokenIDs?.replace(' ', '')
            .split('\n')
            .map(el => el.split(','))
            .map(el => {
              recipientList.push(el[0]);
              tokenIDList.push(parseInt(el[1], 10));
              return false;
            });

          const tx = await state.BatchTransferContract.batchTransfer721(
            state.inputValue.NFTAddress,
            recipientList,
            tokenIDList
          );

          await toast.promise(tx.wait(), {
            pending: 'Transfering...',
            success: 'Transfer successfully',
            error: 'Transfer unsuccessfully',
          });
        }
      }
      await removeCSVTokenIDs();
      dispatch({ type: TRANSFER_END });
    } catch (error) {
      dispatch({ type: DENY_TRANSFER });
      console.error(error);
    }
  };

  const ERC1155transfer = async () => {
    try {
      if (state.BatchTransferContract) {
        dispatch({ type: TRANSFER_BEGIN });

        let recipientList = [];
        let tokenIDList = [];
        let amountList = [];

        state.inputValue.RecipientandTokenIDs?.replace(' ', '')
          .split('\n')
          .map(el => el.split(','))
          .map(el => {
            recipientList.push(el[0]);
            tokenIDList.push([parseInt(el[1], 10)]);
            amountList.push([parseInt(el[2], 10)]);
            return false;
          });

        const tx = await state.BatchTransferContract.batchTransfer1155(
          state.inputValue.NFTAddress,
          recipientList,
          tokenIDList,
          amountList
        );

        await toast.promise(tx.wait(), {
          pending: 'Transfering...',
          success: 'Transfer successfully',
          error: 'Transfer unsuccessfully',
        });
      }
      await removeCSVTokenIDs();
      dispatch({ type: TRANSFER_END });
    } catch (error) {
      dispatch({ type: DENY_TRANSFER });
      console.error(error);
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
    } else if (state.ethereum?.chainId !== '0x4') {
      alert('Please use the Rinkeby chain');
      return;
    } else if (!state.inputValue.RecipientandTokenIDs) {
      alert('Please fill in Recipient address and TokenID');
      return;
    }

    if (!state.isApproved) {
      alert('Please approve your contract first');
      return;
    }

    if (state.ContractValidatePart.ERC721Check) {
      await ERC721transfer();
    }

    if (state.ContractValidatePart.ERC1155Check) {
      await ERC1155transfer();
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
          recipient: state.NFTItemRecipient[e.target.value].recipient,
          value: e.target.value,
        },
      });
    } else if (e.target.checked === false) {
      let regStr = new RegExp(
        `,${e.target.value}\n*|\n*,${e.target.value}|${
          state.NFTItemRecipient[e.target.value].recipient
        },${e.target.value}\n*|\n*${
          state.NFTItemRecipient[e.target.value].recipient
        },${e.target.value}| \n.`,
        'g'
      );
      const tokenIDsArray = Array.from(state.inputValue.RecipientandTokenIDs)
        .join('')
        .replace(regStr, '');
      dispatch({
        type: REMOVE_BULKS_TOKENIDS,
        payload: {
          tokenIDsArray,
          value: e.target.value,
        },
      });
    }
  };

  const importRecipient = recipient => {
    dispatch({ type: IMPORT_RECIPIENT, payload: recipient });
  };

  const cleanAllRecipients = () => {
    for (let i = 0; i < state.NFTAddressTokenIDsOfOwner.length; i++) {
      state.NFTItemRecipient[state.NFTAddressTokenIDsOfOwner[i]] = '';
    }
    dispatch({ type: CLEAN_ALL_NFT_RECIPIENT });
  };

  return (
    <ToolContext.Provider
      value={{
        ...state,
        handleInput,
        handleNFTItemInput,
        approveContract,
        fetchNFTData,
        transfer,
        logout,
        getCSVTokenIDs,
        handleBulksChange,
        removeCSVTokenIDs,
        connect,
        importRecipient,
        cleanAllRecipients,
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
