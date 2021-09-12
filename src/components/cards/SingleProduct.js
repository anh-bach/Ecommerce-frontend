import React, { Fragment, useState } from 'react';
import Card from 'antd/lib/card';
import Skeleton from 'antd/lib/skeleton';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Tabs from 'antd/lib/tabs';
import StarRating from 'react-star-ratings';
import Tooltip from 'antd/lib/tooltip';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';

import laptop from '../../images/laptop.png';
import ProductListItem from './ProductListItem';
import RatingModal from '../modal/RatingModal';
import showAverage from '../../functions/rating';
import { ADD_TO_CART, SET_VISIBLE } from '../../actions/types';
import { addWishlist } from '../../functions/user';

const { TabPane } = Tabs;

const SingleProduct = ({ product, onStarClick, star }) => {
  const history = useHistory();
  const { title, images, description, _id } = product;

  const [tooltip, setTooltip] = useState('Click to add');
  //redux
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state) => state);

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

  const handleWishlistClick = async (productId) => {
    try {
      await addWishlist(user.token, productId);
      toast.success('Product added to wish list');
      history.push('/user/wishlist');
    } catch (error) {
      console.log('From handle wish list', error);
    }
  };

  return (
    <Fragment>
      <div className='col-md-7'>
        {images && images.length > 0 && (
          <Carousel showArrows autoPlay infiniteLoop>
            {images.map((image) => (
              <img key={image.public_id} alt='product' src={image.url} />
            ))}
          </Carousel>
        )}
        {images && images.length === 0 && (
          <Card
            cover={
              <img src={laptop} alt='product' className='mb-3 card-image' />
            }
          ></Card>
        )}
        {!images && (
          <Card>
            <Skeleton active></Skeleton>
          </Card>
        )}
        <Tabs defaultActiveKey='1' type='card'>
          <TabPane tab='Description' key='1'>
            {description && description}
          </TabPane>
          <TabPane tab='More' key='2'>
            Call us on xxx-xxxx--xxx to learn more about the product
          </TabPane>
        </Tabs>
      </div>
      <div className='col-md-5'>
        <h1 className='bg-info p-3'>{title}</h1>
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className='text-center pb-3'>No rating yet</div>
        )}
        <Card
          className='p-1'
          actions={[
            <Tooltip title={tooltip}>
              <a onClick={() => handleAddToCart(product)}>
                <ShoppingCartOutlined className='text-danger' />
                <br /> Add to Cart{' '}
              </a>
            </Tooltip>,
            <a onClick={() => handleWishlistClick(product._id)}>
              <HeartOutlined className='text-info' /> <br />
              Add to Wishlist
            </a>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor='red'
              />
            </RatingModal>,
          ]}
        >
          <ProductListItem product={product} />
        </Card>
      </div>
    </Fragment>
  );
};

export default SingleProduct;
