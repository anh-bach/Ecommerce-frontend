import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getCategory, updateCategory } from '../../../functions/category';
import AdminNav from '../../../components/nav/AdminNav';
import CategoryForm from '../../../components/forms/CategoryForm';

const CategoryUpdate = ({ history }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  const { slug } = useParams();

  useEffect(() => {
    //load category
    getCategory(slug)
      .then((res) => setName(res.data.name))
      .catch((err) => console.log('Error from category update', err.response));
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCategory(slug, name, user.token);
      setLoading(false);
      setName('');
      toast.success('Category is updated');
      history.push('/admin/category');
    } catch (error) {
      console.log('Error from update category submit', error.response);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-10'>
          {loading ? (
            <h4 className='text-danger'>Loading...</h4>
          ) : (
            <h4>Update Category</h4>
          )}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          <hr />
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
