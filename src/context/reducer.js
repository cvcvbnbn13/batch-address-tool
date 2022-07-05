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
  INIT_IS_APPROVED,
  CONNECT,
  LOG_OUT,
  GET_CSV_TOKENIDS,
  GET_NFT_ADDRESS_TOKENIDS,
  GET_NFT_LIST,
  LIST_BULKS_TOKENIDS,
  REMOVE_BULKS_TOKENIDS,
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
      isLoading: true,
    };
  }
  if (action.type === GET_APPROVE_END) {
    return {
      ...state,
      isLoading: false,
    };
  }

  if (action.type === TRANSFER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === TRANSFER_END) {
    return {
      ...state,
      isLoading: false,
      inputValue: {
        ...initialState.inputValue,
      },
    };
  }

  if (action.type === GET_CURRENT_USER) {
    return {
      ...state,
      currentUser: action.payload.accounts[0],
      inputValue: {
        ...state.inputValue,
        TokenIDs: '',
      },
    };
  }
  if (action.type === CHECK_IS_APPROVED) {
    return {
      ...state,
      isApproved: action.payload,
    };
  }

  if (action.type === INIT_IS_APPROVED) {
    return {
      ...state,
      isApproved: false,
    };
  }

  if (action.type === CONNECT) {
    return {
      ...state,
      isConnected: true,
    };
  }

  if (action.type === LOG_OUT) {
    return {
      ...state,
      isConnected: false,
    };
  }

  if (action.type === GET_CSV_TOKENIDS) {
    return {
      ...state,
      csvTokenIDs: action.payload.csvTokenIDs,
    };
  }

  if (action.type === GET_NFT_ADDRESS_TOKENIDS) {
    return {
      ...state,
      NFTAddressTokenIDsOfOwner: action.payload.tokenIDs,
    };
  }

  if (action.type === GET_NFT_LIST) {
    return {
      ...state,
      NFTList: action.payload.NftList,
    };
  }

  if (action.type === LIST_BULKS_TOKENIDS) {
    return {
      ...state,
      inputValue: {
        ...state.inputValue,
        TokenIDs: [
          ...state.inputValue.TokenIDs,
          ...action.payload.tokenIDsArray,
        ].join('\n'),
      },
    };
  }
  if (action.type === REMOVE_BULKS_TOKENIDS) {
    return {
      ...state,
      inputValue: {
        ...state.inputValue,
        TokenIDs: [...action.payload.tokenIDsArray],
      },
    };
  }
};

export default reducer;
