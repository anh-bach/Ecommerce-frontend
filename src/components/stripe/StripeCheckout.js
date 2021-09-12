import React, { useState, useEffect, Fragment } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from 'antd/lib/card';
import { DollarOutlined, CheckOutlined } from '@ant-design/icons';

import Laptop from '../../images/laptop.png';
import { createPaymentIntent } from '../../functions/stripe';
import { createOrder, emptyUserCart } from '../../functions/user';
import { ADD_TO_CART, COUPON_APPLIED } from '../../actions/types';

const cartStyle = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#32325d',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const StripeCheckout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const coupon = useSelector((state) => state.coupon);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    loadPaymentIntent();
  }, [user, coupon]);

  const loadPaymentIntent = async () => {
    try {
      const res = await createPaymentIntent(user.token, coupon);
      setClientSecret(res.data.clientSecret);
      setCartTotal(res.data.cartTotal);
      setTotalAfterDiscount(res.data.totalAfterDiscount);
      setPayable(res.data.payable);
    } catch (error) {
      console.log('From load payment intent', error);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setProcessing(true);

      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: e.target.name.value,
          },
        },
      });

      if (payload.error) {
        setError(`Payment failed ${payload.error.message}`);
        setProcessing(false);
      } else {
        //result after successful payment
        //create order and save in database for admin to process
        const res = await createOrder(user.token, payload);
        if (res.data.ok) {
          //empty user cart from redux and localStorage, reset coupon in redux, emptycart in db
          if (typeof window !== 'undefined') localStorage.removeItem('cart');
          dispatch({ type: ADD_TO_CART, payload: [] });
          dispatch({ type: COUPON_APPLIED, payload: false });
          await emptyUserCart(user.token);
        }

        setError(null);
        setProcessing(false);
        setSucceeded(true);
      }
    } catch (error) {
      console.log('From submit payment', error);
    }
  };

  const handleChange = (e) => {
    setDisabled(e.empty); //disable pay button if errors
    setError(e.error ? e.error.message : ''); //show error message
  };

  return (
    <Fragment>
      {!succeeded && (
        <div>
          {coupon && totalAfterDiscount ? (
            <p className='alert alert-success'>{`Total after discount: $${totalAfterDiscount}`}</p>
          ) : (
            <p className='alert alert-danger'>No Coupon Applied</p>
          )}
        </div>
      )}
      <div className='text-center pb-5'>
        <Card
          cover={
            <img
              src={Laptop}
              style={{
                height: '200px',
                objectFit: 'cover',
                marginBottom: '-50px',
              }}
              alt='pay-cover'
            />
          }
          actions={[
            <Fragment>
              <DollarOutlined className='text-info' />
              <br />
              Total: ${cartTotal}
            </Fragment>,
            <Fragment>
              <CheckOutlined className='text-info' />
              <br />
              Total payable: ${payable / 100}
            </Fragment>,
          ]}
        />
      </div>

      <form id='payment-form' className='stripe-form' onSubmit={handleSubmit}>
        <CardElement
          id='card-element'
          options={cartStyle}
          onChange={handleChange}
        />
        <button
          className='stripe-button'
          disabled={processing || disabled || succeeded}
        >
          <span id='button-text'>
            {processing ? <div className='spinner' id='spinner'></div> : 'Pay'}
          </span>
        </button>
        <br />
        {error && (
          <div className='card-error' role='alert'>
            {error}
          </div>
        )}
        <p className={succeeded ? 'result-message' : 'result-message hidden'}>
          Payment Successful.{' '}
          <Link to='/user/history'>See it in your purchase history</Link>
        </p>
      </form>
    </Fragment>
  );
};

export default StripeCheckout;
