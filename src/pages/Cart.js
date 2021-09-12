import React from 'react';
import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { CASH_ON_DELIVERY } from '../actions/types';

import ProductCardInCheckout from '../components/cards/ProductCardInCheckout';
import { userCart } from '../functions/user';

const Cart = ({ history }) => {
  //redux
  const { cart, user } = useSelector((state) => state);
  const dispatch = useDispatch();

  const getTotal = (cart) => {
    return cart.reduce(
      (accumulator, item) => accumulator + item.count * item.price,
      0
    );
  };

  const showCartItems = () => (
    <table className='table table-bordered'>
      <thead className='thead-light'>
        <tr>
          <th scope='col'>Image</th>
          <th scope='col'>Title</th>
          <th scope='col'>Price</th>
          <th scope='col'>Brand</th>
          <th scope='col'>Color</th>
          <th scope='col'>Count</th>
          <th scope='col'>Shipping</th>
          <th scope='col'>Remove</th>
        </tr>
      </thead>
      <tbody>
        {cart.length > 0 &&
          cart.map((item) => (
            <ProductCardInCheckout key={item._id} product={item} />
          ))}
      </tbody>
    </table>
  );

  const saveOrderToDb = async (cart, authToken) => {
    try {
      //save order in database
      const res = await userCart(cart, authToken);
      if (res.data.ok) history.push('/checkout');
    } catch (error) {
      console.log('From saveOrderToDb', error);
    }
  };

  const saveCashOrderToDb = async (cart, authToken) => {
    try {
      //save order in database
      dispatch({ type: CASH_ON_DELIVERY, payload: true });
      const res = await userCart(cart, authToken);
      if (res.data.ok) history.push('/checkout');
    } catch (error) {
      console.log('From saveCashOrderToDb', error);
    }
  };

  return (
    <div className='container-fluid pt-2'>
      <div className='row'>
        <div className='col-md-8'>
          <h4>Card / {cart.length} Products</h4>

          {cart.length > 0 ? (
            showCartItems()
          ) : (
            <p>
              No products in cart. <Link to='/shop'>Continue Shopping</Link>
            </p>
          )}
        </div>
        <div className='col-md-4'>
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.length > 0 &&
            cart.map((item, index) => (
              <div key={index}>
                <p>
                  {item.title} x {item.count} = ${item.count * item.price}
                </p>
              </div>
            ))}
          <hr />
          <div>
            Total: <b>${getTotal(cart)}</b>
          </div>
          <hr />
          {user ? (
            <Fragment>
              <button
                onClick={() => saveOrderToDb(cart, user.token)}
                className='btn btn-sm btn-primary mt-2'
                disabled={!cart.length}
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => saveCashOrderToDb(cart, user.token)}
                className='btn btn-sm btn-danger mt-2'
                disabled={!cart.length}
              >
                Pay Cash on Delivery
              </button>
            </Fragment>
          ) : (
            <button className='btn btn-sm btn-primary mt-2'>
              <Link
                to={{
                  pathname: '/login',
                  state: { from: 'cart' },
                }}
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
