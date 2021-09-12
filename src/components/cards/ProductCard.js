import React, { Fragment, useState } from 'react';
import Card from 'antd/lib/card';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Tooltip from 'antd/lib/tooltip';
import { useDispatch } from 'react-redux';

import laptop from '../../images/laptop.png';
import showAverage from '../../functions/rating';
import { ADD_TO_CART, SET_VISIBLE } from '../../actions/types';
const { Meta } = Card;

const ProductCard = ({ product }) => {
  const { images, slug, title, description, price, quantity } = product;
  const [tooltip, setTooltip] = useState('Click to add');
  //redux
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    //create cart array
    let cart = [];
    if (typeof window !== 'undefined') {
      //if cart is in the localStorage
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      //push new product to Cart

      cart.push({
        ...product,
        count: 1,
      });

      //remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      console.log(unique);

      //save to localStorage
      localStorage.setItem('cart', JSON.stringify(unique));
      //Add to redux store
      dispatch({
        type: ADD_TO_CART,
        payload: unique,
      });
      //show drawers
      dispatch({
        type: SET_VISIBLE,
        payload: true,
      });
      //show tooltip
      setTooltip('Added');
    }
  };

  return (
    <Fragment>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className='text-center pt-1 pb-3'>No rating yet</div>
      )}
      <Card
        cover={
          <img
            src={images && images.length > 0 ? images[0].url : laptop}
            alt='product'
          />
        }
        style={{ objectFit: 'cover' }}
        className='p-1'
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className='text-warning' /> <br /> View Product
          </Link>,
          <Tooltip title={tooltip}>
            <a onClick={() => handleAddToCart(product)} disabled={!quantity}>
              <ShoppingCartOutlined className='text-danger' />
              <br /> {quantity < 1 ? 'Out of stock' : 'Add to Cart'}
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - $${price}`}
          description={`${description && description.substring(0, 30)}...`}
        />
      </Card>
    </Fragment>
  );
};

export default ProductCard;
