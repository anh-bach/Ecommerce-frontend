import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';

import UserNav from '../../components/nav/UserNav';
import { getWishlist, removeWishlist } from '../../functions/user';

const Wishlist = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await getWishlist(user.token);
      setWishlist(res.data.wishlist);
      setLoading(false);
    } catch (error) {
      console.log('From load wishlist', error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setLoading(true);
      await removeWishlist(user.token, productId);
      await loadWishlist();
      setLoading(false);
      toast.error('Product removed from wishlist');
    } catch (error) {
      console.log('From remove wishlist', error);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <UserNav />
        </div>
        <div className='col-md-10'>
          {loading ? (
            <h4 className='text-danger'>Loading...</h4>
          ) : (
            <h4>User Wishlist</h4>
          )}
          {wishlist.map((product) => (
            <div key={product._id} className='alert alert-secondary'>
              <Link to={`/product/${product.slug}`}>{product.title}</Link>
              <span
                className='btn btn-sm float-right'
                onClick={() => handleRemove(product._id)}
              >
                <DeleteOutlined className='text-danger' />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
