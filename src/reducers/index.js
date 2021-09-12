import { combineReducers } from 'redux';
import userReducer from './userReducer';
import searchReducer from './searchReducer';
import cartReducer from './cartReducer';
import drawerReducer from './drawerReducer';
import couponReducer from './couponReducer';
import cashReducer from './CODReducer';

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  drawer: drawerReducer,
  coupon: couponReducer,
  COD: cashReducer,
});

export default rootReducer;
