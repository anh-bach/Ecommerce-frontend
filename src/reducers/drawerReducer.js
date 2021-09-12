import { SET_VISIBLE } from '../actions/types';

const drawerReducer = (state = false, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_VISIBLE:
      return payload;

    default:
      return state;
  }
};

export default drawerReducer;
