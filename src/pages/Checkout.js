import React, { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from '../functions/user';
import {
  ADD_TO_CART,
  CASH_ON_DELIVERY,
  COUPON_APPLIED,
} from '../actions/types';

const Checkout = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState('');
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const { user, COD } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getUserCart(user.token);

      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
      setLoading(false);
    } catch (error) {
      console.log('from Checkout Load Products', error);
    }
  };

  const emptyCart = async () => {
    if (typeof window !== 'undefined') {
      try {
        setLoading(true);
        //remove from localStorage
        localStorage.removeItem('cart');
        //remove from redux
        dispatch({ type: ADD_TO_CART, payload: [] });
        //remove from backend
        await emptyUserCart(user.token);
        setProducts([]);
        setTotal(0);
        setTotalAfterDiscount(0);
        setCoupon('');
        toast.success('Cart is empty. Continue Shopping');
        setLoading(false);
      } catch (error) {
        console.log('From empty cart', error);
      }
    }
  };

  const saveAddressToDb = async () => {
    try {
      if (!address) {
        toast.error('Please Fill In Your Address to proceed the order');
        return;
      }
      const res = await saveUserAddress(
        user.token,
        address.slice(3, address.length - 4)
      );

      if (res.data.ok) {
        setAddressSaved(true);
        toast.success('Address Saved');
      }
    } catch (error) {
      console.log('From save address', error);
    }
  };

  const applyDiscountCoupon = async () => {
    try {
      const res = await applyCoupon(user.token, coupon);

      if (res.data) {
        setTotalAfterDiscount(res.data);
        //update redux coupon applied
        dispatch({ type: COUPON_APPLIED, payload: true });
      }
      if (res.data.err) {
        setDiscountError(res.data.err);
        //update redux coupon applied
        dispatch({ type: COUPON_APPLIED, payload: false });
      }
    } catch (error) {
      console.log('From apply discount coupon', error);
    }
  };

  const showAddress = () => (
    <Fragment>
      <ReactQuill theme='snow' value={address} onChange={setAddress} />
      <button className='btn btn-primary mt-2' onClick={saveAddressToDb}>
        Save
      </button>
    </Fragment>
  );

  const showProductSummary = () =>
    products.map((item, index) => (
      <div key={index}>
        <p>
          {item.product.title} ({item.color}) x {item.count} = $
          {item.product.price * item.count}
        </p>
      </div>
    ));

  const showApplyCoupon = () => (
    <Fragment>
      <input
        type='text'
        className='form-control'
        value={coupon}
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError('');
        }}
      />
      <button className='btn btn-primary mt-2' onClick={applyDiscountCoupon}>
        Apply
      </button>
    </Fragment>
  );

  const createCashOrder = async () => {
    try {
      const res = await createCashOrderForUser(user.token, COD, coupon);
      //empty cart redux, loclaStorage
      if (res.data.ok) {
        localStorage.removeItem('cart');
        dispatch({ type: ADD_TO_CART, payload: [] });
        dispatch({ type: COUPON_APPLIED, payload: false });
        dispatch({ type: CASH_ON_DELIVERY, payload: false });
        //empty cart from backend
        await emptyUserCart(user.token);
        //redirect
        history.push('/user/history');
      }
    } catch (error) {
      console.log('From cash order', error);
    }
  };

  return (
    <div className='row mt-2 px-2'>
      <div className='col-md-6'>
        <h4>Delivery Address</h4>
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        {showApplyCoupon()}
        <br />
        {discountError && <p className='bg-danger p-2'>{discountError}</p>}
      </div>
      <div className='col-md-6'>
        {loading ? (
          <h4 className='text-danger'>Loading...</h4>
        ) : (
          <h4>Order Summary</h4>
        )}
        <hr />
        <p>Products {products.length}</p>
        <hr />
        {products.length > 0 && showProductSummary()}

        <hr />
        <p>Cart Total: ${total}</p>

        {totalAfterDiscount > 0 && (
          <p className='bg-success p-2'>
            Discount Applied: Total Payment: ${totalAfterDiscount}
          </p>
        )}

        <div className='row'>
          <div className='col-md-6'>
            {COD ? (
              <button
                className='btn btn-primary'
                disabled={!addressSaved || !products.length}
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                className='btn btn-primary'
                disabled={!addressSaved || !products.length}
                onClick={() => history.push('/payment')}
              >
                Place Order
              </button>
            )}
          </div>
          <div className='col-md-6'>
            <button
              className='btn btn-primary'
              onClick={emptyCart}
              disabled={!products.length}
            >
              Empty Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
