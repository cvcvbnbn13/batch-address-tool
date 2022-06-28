import { initialState } from './toolProvider';

import { INIT_BATCH_TOOL, HANDLE_INPUT_TOOL } from './actions';

const reducer = (state, action) => {
  if (action.type === INIT_BATCH_TOOL) {
    return {
      ...state,
      ethereum: window.ethereum,
      contract: action.payload.signedContract,
      isLoading: false,
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
};

export default reducer;
