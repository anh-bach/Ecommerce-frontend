import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Drawer from 'antd/lib/drawer';
import Button from 'antd/lib/button';

import laptop from '../../images/laptop.png';
import { SET_VISIBLE } from '../../actions/types';

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => state);

  const imageStyle = {
    width: '100%',
    height: '50px',
    objectFit: 'cover',
  };

  return (
    <Drawer
      className='text-center'
      title={`Cart / ${cart.length} Products`}
      placement='right'
      closable={false}
      onClose={() => {
        dispatch({
          type: SET_VISIBLE,
          payload: false,
        });
      }}
      visible={drawer}
    >
      {cart.length > 0 &&
        cart.map((item) => (
          <div className='row' key={item._id}>
            <div className='col'>
              {item.images.length > 0 ? (
                <Fragment>
                  <img
                    src={item.images[0].url}
                    alt='product'
                    style={imageStyle}
                  />
                  <p className='text-center bg-secondary text-light'>
                    {item.title} x {item.count}
                  </p>
                </Fragment>
              ) : (
                <Fragment>
                  <img src={laptop} alt='product' style={imageStyle} />
                  <p className='text-center bg-secondary text-light'>
                    {item.title} x {item.count}
                  </p>
                </Fragment>
              )}
            </div>
          </div>
        ))}
      <Link to='/cart'>
        <Button
          onClick={() => {
            dispatch({
              type: SET_VISIBLE,
              payload: false,
            });
          }}
          className='text-center btn btn-primary btn-raised btn-block'
        >
          Go To Cart
        </Button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
