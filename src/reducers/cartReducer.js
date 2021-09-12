import { ADD_TO_CART } from '../actions/types';

let initialState = [];

//load cart items from localStorage
if (typeof window !== 'undefined') {
  if (localStorage.getItem('cart')) {
    initialState = JSON.parse(localStorage.getItem('cart'));
  }
}

const cartReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_TO_CART:
      return payload;

    default:
      return state;
  }
};

export default cartReducer;
