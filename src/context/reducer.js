import { initialState } from './toolProvider';

import {
  INIT_BATCH_TOOL,
  HANDLE_INPUT_TOOL,
  GET_APPROVE_BEGIN,
  GET_APPROVE_END,
} from './actions';

const reducer = (state, action) => {
  if (action.type === INIT_BATCH_TOOL) {
    return {
      ...state,
      ethereum: window.ethereum,
      contract: action.payload.signedContract,
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
};

export default reducer;
