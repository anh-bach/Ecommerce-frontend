import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { getCategories } from '../../../functions/category';
import { getSubs, createSub, removeSub } from '../../../functions/sub';
import AdminNav from '../../../components/nav/AdminNav';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';

const SubCreate = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [subs, setSubs] = useState([]);
  //searching-filtering 1))
  const [keyword, setKeyword] = useState('');

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.log('from load categories', error.response);
    }
  };

  const loadSubs = async () => {
    try {
      const res = await getSubs();
      setSubs(res.data);
    } catch (error) {
      console.log('from load sub categories', error.response);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createSub(name, category, user.token);
      setLoading(false);
      setName('');
      toast.success(`${res.data.name} is created.`);
      loadSubs();
    } catch (error) {
      console.log('from create sub category', error.response);
      setLoading(false);
      toast.error(error.response.data.err);
    }
  };

  const handleRemove = async (slug) => {
    if (window.confirm('Delete?')) {
      setLoading(true);
      try {
        const res = await removeSub(slug, user.token);
        setLoading(false);
        toast.success(`${res.data.name} is deleted.`);
        loadSubs();
      } catch (error) {
        setLoading(false);
        console.log('From delete sub category', error.response);
        toast.error(error.response.data.err);
      }
    }
  };

  //search-filter
  const search = (keyword) => (subcategory) =>
    subcategory.name.toLowerCase().includes(keyword.toLowerCase());

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
            <h4>Create Sub Category</h4>
          )}
          <div className='form-group'>
            <label>Parent Category</label>
            <select
              className='form-control'
              name='category'
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              required
            >
              <option value=''>Please select category</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />
          {subs.length &&
            subs.filter(search(keyword)).map((sub) => (
              <div key={sub._id} className='alert alert-secondary'>
                {sub.name}{' '}
                <span
                  className='btn btn-sm float-right'
                  onClick={() => handleRemove(sub.slug)}
                >
                  <DeleteOutlined className='text-danger' />
                </span>{' '}
                <Link to={`/admin/sub/${sub.slug}`}>
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

export default SubCreate;
