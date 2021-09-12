import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import { getProduct, getRelated, productStar } from '../functions/product';
import SingleProduct from '../components/cards/SingleProduct';
import ProductCard from '../components/cards/ProductCard';
import LoadingCard from '../components/cards/LoadingCard';

const Product = () => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [star, setStar] = useState(0);

  const { slug } = useParams();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadSingleProduct(slug);
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObj = product.ratings.find(
        (el) => el.postedBy.toString() === user._id.toString()
      );

      existingRatingObj && setStar(existingRatingObj.star);
    }
  }, [user, product.ratings]);

  const loadSingleProduct = async (slug) => {
    try {
      setLoading(true);
      const res = await getProduct(slug);
      setProduct(res.data);
      const relatedRes = await getRelated(res.data._id);
      setRelated(relatedRes.data);
      setLoading(false);
    } catch (error) {
      console.log('From load Single Product', error.response);
      setLoading(false);
    }
  };

  const onStarClick = async (newRating, name) => {
    try {
      setStar(newRating);
      await productStar(name, newRating, user.token);
      loadSingleProduct(slug);
    } catch (error) {
      console.log('From product on star click', error.response);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row pt-4'>
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>
      <div className='row'>
        <div className='col text-center py-5'>
          <hr />
          <h4>Related Products</h4>
          <div className='container'>
            {loading ? (
              <LoadingCard count={3} />
            ) : (
              <div className='row'>
                {related.length ? (
                  related.map((product) => (
                    <div className='col-md-4' key={product._id}>
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className='text-center col'>No products found</div>
                )}
              </div>
            )}
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Product;
