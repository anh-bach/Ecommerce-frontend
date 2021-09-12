import { CASH_ON_DELIVERY } from '../actions/types';

const cashReducer = (state = false, action) => {
  const { type, payload } = action;

  switch (type) {
    case CASH_ON_DELIVERY:
      return payload;

    default:
      return state;
  }
};

export default cashReducer;
