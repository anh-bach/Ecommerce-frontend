import React, { useState, useEffect, Fragment } from 'react';
import Pagination from 'antd/lib/pagination';

import { listProducts, getProductsCount } from '../../functions/product';
import ProductCard from '../cards/ProductCard';
import LoadingCard from '../cards/LoadingCard';

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount()
      .then((res) => setProductsCount(res.data))
      .catch((error) => console.log('from get products count', error.response));
  }, []);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const res = await listProducts('sold', 'descending', page);
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.log('From BestSellers loading products', error.response);
    }
  };

  return (
    <Fragment>
      <div className='container'>
        {loading ? (
          <LoadingCard count={3} />
        ) : (
          <div className='row'>
            {products.map((product) => (
              <div className='col-md-4' key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='row'>
        <nav className='col-md-4 offset-md-4 text-center p-3 pt-5'>
          <Pagination
            current={page}
            total={(productsCount / 3) * 10}
            onChange={(value) => setPage(value)}
          />
        </nav>
      </div>
    </Fragment>
  );
};

export default BestSellers;
