import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import { getCategories } from '../../../functions/category';
import { getSub, updateSub } from '../../../functions/sub';
import AdminNav from '../../../components/nav/AdminNav';
import CategoryForm from '../../../components/forms/CategoryForm';

const SubUpdate = ({ history }) => {
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const user = useSelector((state) => state.user);
  const { slug } = useParams();

  useEffect(() => {
    loadCategories();
    loadSub();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.log('from load categories', error.response);
    }
  };

  const loadSub = async () => {
    try {
      const res = await getSub(slug);
      setName(res.data.name);
      setParent(res.data.parent);
    } catch (error) {
      console.log('from load sub', error.response);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateSub(slug, name, parent, user.token);
      setLoading(false);
      setName('');
      setParent('');
      toast.success(`${res.data.name} is updated.`);
      history.push('/admin/sub');
    } catch (error) {
      console.log('from create sub category', error.response);
      setLoading(false);
      toast.error(error.response.data.err);
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
            <h4>Update Sub Category</h4>
          )}
          <div className='form-group'>
            <label>Parent Category</label>
            <select
              className='form-control'
              name='category'
              onChange={(e) => setParent(e.target.value)}
              value={parent}
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
        </div>
      </div>
    </div>
  );
};

export default SubUpdate;
