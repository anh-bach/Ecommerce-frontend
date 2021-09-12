import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router';

import ProductCard from '../../components/cards/ProductCard';
import { getCategory } from '../../functions/category';
import LoadingCard from '../../components/cards/LoadingCard';

const CategoryHome = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategory(slug);
  }, [slug]);

  const loadCategory = async (slug) => {
    setLoading(true);
    try {
      const res = await getCategory(slug);
      setCategory(res.data.category);
      setProducts(res.data.products);
      setLoading(false);
    } catch (error) {
      console.log('From category home', error.response);
    }
  };

  return (
    <Fragment>
      <div className='row'>
        <div className='col'>
          {loading ? (
            <h4 className='jumbotron text-center text-danger my-5 display-4'>
              Loading...
            </h4>
          ) : (
            <h4 className='jumbotron text-center p-3 my-5 display-4'>
              {products.length} {products.length > 1 ? 'Products' : 'Product'}{' '}
              in "{category.name}" category
            </h4>
          )}
        </div>
      </div>
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
    </Fragment>
  );
};

export default CategoryHome;
