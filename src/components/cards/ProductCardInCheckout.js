import React from 'react';
import ModalImage from 'react-modal-image';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import { ADD_TO_CART } from '../../actions/types';
import laptop from '../../images/laptop.png';

const ProductCardInCheckout = ({ product }) => {
  const { images, title, price, brand, color, shipping, count } = product;
  const colors = ['Black', 'Brown', 'Silver', 'White', 'Blue'];
  const dispatch = useDispatch();

  const handleColorChange = (e, product) => {
    let cart = [];
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }

      //update color
      if (cart.length > 0) {
        cart.forEach((item) => {
          if (item._id === product._id) {
            item.color = e.target.value;
          }
        });
      }

      //save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      //save redux store
      dispatch({
        type: ADD_TO_CART,
        payload: cart,
      });
    }
  };

  const handleQuantityChange = (e, product) => {
    let cart = [];
    let count = e.target.value < 1 ? 1 : e.target.value;
    if (count > product.quantity) {
      toast.error(`Max available quantity: ${product.quantity}`);
      return;
    }
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }

      //update color
      if (cart.length > 0) {
        cart.forEach((item) => {
          if (item._id === product._id) {
            item.count = count;
          }
        });
      }

      //save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      //save redux store
      dispatch({
        type: ADD_TO_CART,
        payload: cart,
      });
    }
  };

  const handleRemove = (product) => {
    let cart = [];

    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }

      //update color
      if (cart.length > 0) {
        cart.forEach((item, index) => {
          if (item._id === product._id) {
            cart.splice(index, 1);
          }
        });
      }

      //save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      //save redux store
      dispatch({
        type: ADD_TO_CART,
        payload: cart,
      });
    }
  };

  return (
    <tr>
      <td>
        <div style={{ width: '100px', height: 'auto' }}>
          {images && images.length > 0 ? (
            <ModalImage small={images[0].url} large={images[0].url} />
          ) : (
            <ModalImage small={laptop} large={laptop} />
          )}
        </div>
      </td>
      <td>{title}</td>
      <td>{price}</td>
      <td>{brand}</td>
      <td>
        <select
          onChange={(e) => handleColorChange(e, product)}
          name='color'
          className='form-control'
        >
          {color ? (
            <option value={color}>{color}</option>
          ) : (
            <option>Select</option>
          )}
          {colors
            .filter((item) => item !== color)
            .map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
        </select>
      </td>
      <td>
        <input
          type='number'
          className='form-control text-center'
          name='count'
          value={count}
          onChange={(e) => handleQuantityChange(e, product)}
        />
      </td>
      <td className='text-center'>
        {shipping === 'Yes' ? (
          <CheckCircleOutlined className='text-success' />
        ) : (
          <CloseCircleOutlined className='text-danger' />
        )}
      </td>
      <td className='text-center'>
        <CloseOutlined
          className='text-danger pointer'
          onClick={() => handleRemove(product)}
        />
      </td>
    </tr>
  );
};

export default ProductCardInCheckout;
