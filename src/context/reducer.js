import { initialState } from './toolProvider';

import {
  INIT_BATCH_TOOL,
  HANDLE_INPUT_TOOL,
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
} from './actions';

const reducer = (state, action) => {
  if (action.type === INIT_BATCH_TOOL) {
    return {
      ...state,
      ethereum: window.ethereum,
      currentUser: window.ethereum?.selectedAddress,
      BatchTransferContract: action.payload.signedContract,
      ERC721Contract: action.payload.signedERC721Contract,
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
      isLoading: false,
    };
  }
  if (action.type === GET_CURRENT_USER) {
    return state.csvTokenIDs === null
      ? {
          ...state,
          currentUser: action.payload.accounts[0],
          inputValue: {
            ...state.inputValue,
            TokenIDs: '',
          },
          isUnlocked: true,
        }
      : {
          ...state,
          currentUser: action.payload.accounts[0],
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
        Recipient: '',
        TokenIDs: '',
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
    };
  }

  if (action.type === GET_NFT_LIST_END) {
    return {
      ...state,
      isLoading: false,
      NFTList: action.payload.nftList,
    };
  }

  if (action.type === LIST_BULKS_TOKENIDS) {
    return {
      ...state,
      inputValue: {
        ...state.inputValue,
        TokenIDs: [state.inputValue.TokenIDs, action.payload.tokenIDsArray]
          .join('\n')
          .replace(/^\n/, ''),
      },
    };
  }

  if (action.type === REMOVE_BULKS_TOKENIDS) {
    return {
      ...state,
      inputValue: {
        ...state.inputValue,
        TokenIDs: [action.payload.tokenIDsArray].filter(el => el),
      },
    };
  }

  if (action.type === DECONSTRUCT_CSV) {
    const recipientsArray = [];
    const tokenIDsArray = [];
    for (let i = 0; i < action.payload.multipleTransferationList.length; i++) {
      recipientsArray.push(
        action.payload.multipleTransferationList[i].Recipient
      );

      tokenIDsArray.push(
        action.payload.multipleTransferationList[i].TokenIDs.join()
          .split(',')
          .join('\n')
      );
    }

    return {
      ...state,
      multipleTransferationList: action.payload.multipleTransferationList,
      inputValue: {
        ...state.inputValue,
        Recipient: [...recipientsArray].join('\n'),
        TokenIDs: [...tokenIDsArray].join('\n'),
      },
    };
  }

  if (action.type === CHECK_ISUNLOCKED) {
    return {
      ...state,
      isUnlocked: action.payload.unlocked,
    };
  }
};

export default reducer;
