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
  LOG_OUT,
  GET_CSV_TOKENIDS,
  GET_NFT_ADDRESS_TOKENIDS,
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
    };
  }

  if (action.type === GET_CURRENT_USER) {
    return {
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

  if (action.type === INIT_IS_APPROVED) {
    return {
      ...state,
      isApproved: false,
    };
  }

  if (action.type === LOG_OUT) {
    return {
      ...state,
      currentUser: action.payload,
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
      NFTAddressTokenIDs: action.payload.tokenIDs,
    };
  }
};

export default reducer;
