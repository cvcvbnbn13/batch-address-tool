import { initialState } from './toolProvider';

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
  CONNECT,
  LOG_OUT,
  GET_CSV_TOKENIDS,
  REMOVE_CSV_TOKENIDS,
  GET_NFT_ADDRESS_TOKENIDS,
  GET_NFT_LIST_BEGIN,
  GET_NFT_LIST_END,
  LIST_BULKS_TOKENIDS,
  REMOVE_BULKS_TOKENIDS,
  DECONSTRUCT_CSV,
  DENY_TRANSFER,
  CHECK_ISUNLOCKED,
  GET_CURRENT_CHAINID,
  CHECK_ADDR_IS_CONTRACT,
  ADDR_IS_NOT_CONTRACT,
  ERC_721_CHECK,
  ERC_1155_CHECK,
  NFTADDRESS_IS_EMPTY,
  IMPORT_RECIPIENT,
  CLEAN_ALL_NFT_RECIPIENT,
} from './actions';

const reducer = (state, action) => {
  if (action.type === INIT_BATCH_TOOL) {
    return {
      ...state,
      ethereum: window.ethereum,
      currentUser: window.ethereum?.selectedAddress,
      BatchTransferContract: action.payload.signedContract,
      ERC721Contract: action.payload.signedERC721Contract,
      ERC1155Contract: action.payload.signedERC1155Contract,
    };
  }

  if (action.type === HANDLE_INPUT_TOOL) {
    return {
      ...state,
      inputValue: {
        ...state.inputValue,
        [action.payload.name]: action.payload.value,
      },
    };
  }

  if (action.type === HANDLE_NFTITEM_INPUT_TOOL) {
    return {
      ...state,
      inputValue: {
        ...state.inputValue,
        RecipientandTokenIDs: [action.payload.tokenIDsArray].filter(el => el),
      },
      NFTItemRecipient: {
        ...state.NFTItemRecipient,
        [action.payload.name]: {
          ...state.NFTItemRecipient[action.payload.name],
          recipient: action.payload.value,
          checked: false,
        },
      },
    };
  }
  if (action.type === GET_APPROVE_BEGIN) {
    return {
      ...state,
      isApproving: true,
    };
  }
  if (action.type === GET_APPROVE_END) {
    return {
      ...state,
      isApproving: false,
    };
  }

  if (action.type === TRANSFER_BEGIN) {
    return {
      ...state,
      isTransfering: true,
    };
  }
  if (action.type === TRANSFER_END) {
    return {
      ...initialState,
      isTransfering: false,
    };
  }
  if (action.type === DENY_TRANSFER) {
    return {
      ...state,
      isTransfering: false,
    };
  }
  if (action.type === GET_CURRENT_USER) {
    return state.csvTokenIDs === null
      ? {
          ...state,
          currentUser: action.payload.accounts[0],
          inputValue: {
            ...state.inputValue,
            RecipientandTokenIDs: '',
          },
          isUnlocked: true,
          NFTList: [],
        }
      : {
          ...state,
          currentUser: action.payload.accounts[0],
        };
  }

  if (action.type === GET_CURRENT_CHAINID) {
    return {
      ...state,
      currentChains: action.payload.chainId,
    };
  }

  if (action.type === CHECK_IS_APPROVED) {
    return {
      ...state,
      isApproved: action.payload,
    };
  }

  if (action.type === CONNECT) {
    return {
      ...state,
      isConnected: true,
      ethereum: window.ethereum,
    };
  }

  if (action.type === LOG_OUT) {
    return {
      ...state,
      isConnected: false,
      ethereum: null,
      NFTList: [],
      isApproved: false,
    };
  }

  if (action.type === GET_CSV_TOKENIDS) {
    return {
      ...state,
      csvTokenIDs: action.payload.csvTokenIDs,
    };
  }

  if (action.type === REMOVE_CSV_TOKENIDS) {
    return {
      ...state,
      csvTokenIDs: null,
      multipleTransferationList: [],
      inputValue: {
        ...state.inputValue,
        RecipientandTokenIDs: '',
      },
    };
  }

  if (action.type === GET_NFT_ADDRESS_TOKENIDS) {
    return {
      ...state,
      NFTAddressTokenIDsOfOwner: action.payload.tokenIDs,
    };
  }

  if (action.type === GET_NFT_LIST_BEGIN) {
    return {
      ...state,
      isLoading: true,
      isFetchNFTData: true,
    };
  }

  if (action.type === GET_NFT_LIST_END) {
    return {
      ...state,
      isLoading: false,
      isFetchNFTData: false,
      NFTList: action.payload.nftList,
    };
  }

  if (action.type === LIST_BULKS_TOKENIDS) {
    return {
      ...state,
      inputValue: {
        ...state.inputValue,
        RecipientandTokenIDs: [
          state.inputValue.RecipientandTokenIDs,
          [action.payload.recipient, action.payload.value],
        ]
          .join('\n')
          .replace(/^\n/, ''),
      },
      NFTItemRecipient: {
        ...state.NFTItemRecipient,
        [action.payload.value]: {
          ...state.NFTItemRecipient[action.payload.value],
          checked: true,
        },
      },
    };
  }

  if (action.type === REMOVE_BULKS_TOKENIDS) {
    return {
      ...state,
      inputValue: {
        ...state.inputValue,
        RecipientandTokenIDs: [action.payload.tokenIDsArray].filter(el => el),
      },
      NFTItemRecipient: {
        ...state.NFTItemRecipient,
        [action.payload.value]: {
          ...state.NFTItemRecipient[action.payload.value],
          checked: false,
        },
      },
    };
  }

  if (action.type === DECONSTRUCT_CSV) {
    const tokenIDsArray = [];
    for (let i = 0; i < action.payload.multipleTransferationList.length; i++) {
      const tokenIDs =
        action.payload.multipleTransferationList[i]?.TokenIDs.join().split(',');
      for (let j = 0; j < tokenIDs.length; j++) {
        tokenIDsArray.push([
          action.payload.multipleTransferationList[i]?.Recipient,
          tokenIDs[j],
        ]);
      }
    }

    return {
      ...state,
      multipleTransferationList: action.payload.multipleTransferationList,
      inputValue: {
        ...state.inputValue,
        RecipientandTokenIDs: [...tokenIDsArray].join('\n'),
      },
    };
  }

  if (action.type === CHECK_ISUNLOCKED) {
    return {
      ...state,
      isUnlocked: action.payload.unlocked,
    };
  }

  if (action.type === CHECK_ADDR_IS_CONTRACT) {
    return {
      ...state,
      ContractValidatePart: {
        ...state.ContractValidatePart,
        addrIsContract: action.payload.isContract,
      },
    };
  }

  if (action.type === ADDR_IS_NOT_CONTRACT) {
    return {
      ...state,
      ContractValidatePart: {
        addrIsContract: action.payload.isContract,
        ERC721Check: null,
        ERC1155Check: null,
      },
    };
  }
  if (action.type === ERC_721_CHECK) {
    return {
      ...state,
      ContractValidatePart: {
        ...state.ContractValidatePart,
        ERC721Check: action.payload.res,
      },
    };
  }

  if (action.type === ERC_1155_CHECK) {
    return {
      ...state,
      ContractValidatePart: {
        ...state.ContractValidatePart,
        ERC1155Check: action.payload.res,
      },
    };
  }

  if (action.type === NFTADDRESS_IS_EMPTY) {
    return {
      ...initialState,
    };
  }

  if (action.type === IMPORT_RECIPIENT) {
    Object.values(state.NFTItemRecipient).forEach(el => {
      if (el.checked === true) {
        el.recipient = action.payload;
      }
    });

    const res = Object.entries(state.NFTItemRecipient).filter(
      ([key, value]) => {
        return value.checked === true;
      }
    );

    const rtArray = [];

    for (let i = 0; i < res.length; i++) {
      rtArray.push([res[i][1].recipient, res[i][0]]);
    }

    // Object.entries(state.NFTItemRecipient).forEach(([key, value]) => {
    //   if (value.checked === true) {
    //     state.inputValue.RecipientandTokenIDs = [
    //       state.inputValue.RecipientandTokenIDs,
    //       [action.payload, key],
    //     ]
    //       .join('\n')
    //       .replace(/^\n/, '');
    //   }
    // });

    return {
      ...state,
      inputValue: {
        ...state.inputValue,
        RecipientandTokenIDs: rtArray.join('\n').replace(/^\n/, ''),
      },
    };
  }

  if (action.type === CLEAN_ALL_NFT_RECIPIENT) {
    return {
      ...state,
      inputValue: {
        ...state.inputValue,
        RecipientandTokenIDs: '',
      },
    };
  }
};

export default reducer;
