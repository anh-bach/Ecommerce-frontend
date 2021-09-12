import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getSubs } from '../../functions/sub';

const SubList = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubCategories();
  }, []);

  const loadSubCategories = async () => {
    setLoading(true);
    try {
      const res = await getSubs();
      setSubCategories(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('From sub categories', error.response);
    }
  };

  const showSubCategories = () =>
    subCategories.map((subcategory) => (
      <Link key={subcategory._id} to={`/sub/${subcategory.slug}`}>
        {' '}
        <div className='btn btn-outline-primary btn-raised m-3'>
          {subcategory.name}
        </div>
      </Link>
    ));

  return (
    <div className='container'>
      <div className='row'>
        {loading ? (
          <h4 className='text-center text-danger'>Loading...</h4>
        ) : (
          showSubCategories()
        )}
      </div>
    </div>
  );
};

export default SubList;
