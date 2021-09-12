import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getCategories } from '../../functions/category';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('From categories', error.response);
    }
  };

  const showCategories = () =>
    categories.map((category) => (
      <Link key={category._id} to={`/category/${category.slug}`}>
        {' '}
        <div className='btn btn-outline-primary btn-raised m-3'>
          {category.name}
        </div>
      </Link>
    ));

  return (
    <div className='container'>
      <div className='row'>
        {loading ? (
          <h4 className='text-center text-danger'>Loading...</h4>
        ) : (
          showCategories()
        )}
      </div>
    </div>
  );
};

export default CategoryList;
