import { LOGGED_IN_USER, LOGOUT } from '../actions/types';

const userReducer = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGGED_IN_USER:
      return payload;

    case LOGOUT:
      return payload;

    default:
      return state;
  }
};

export default userReducer;
