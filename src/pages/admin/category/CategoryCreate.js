import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import {
  createCategory,
  getCategories,
  removeCategory,
} from '../../../functions/category';
import AdminNav from '../../../components/nav/AdminNav';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';

const CategoryCreate = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  //searching-filtering 1))
  const [keyword, setKeyword] = useState('');

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.log('from load categories', error.response);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createCategory(name, user.token);
      setLoading(false);
      setName('');
      toast.success(`${res.data.name} is created.`);
      loadCategories();
    } catch (error) {
      console.log('from create category', error.response);
      setLoading(false);
      toast.error(error.response.data.err);
    }
  };

  const handleRemove = async (slug) => {
    if (window.confirm('Delete?')) {
      setLoading(true);
      try {
        const res = await removeCategory(slug, user.token);
        setLoading(false);
        toast.success(`${res.data.name} is deleted.`);
        loadCategories();
      } catch (error) {
        setLoading(false);
        console.log('From delete category', error.response);
        toast.error(error.response.data.err);
      }
    }
  };

  //search-filter
  const search = (keyword) => (category) =>
    category.name.toLowerCase().includes(keyword.toLowerCase());

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
            <h4>Create Category</h4>
          )}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />

          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {categories.length &&
            categories.filter(search(keyword)).map((category) => (
              <div key={category._id} className='alert alert-secondary'>
                {category.name}{' '}
                <span
                  className='btn btn-sm float-right'
                  onClick={() => handleRemove(category.slug)}
                >
                  <DeleteOutlined className='text-danger' />
                </span>{' '}
                <Link to={`/admin/category/${category.slug}`}>
                  <span className='btn btn-sm float-right'>
                    <EditOutlined className='text-warning' />
                  </span>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
