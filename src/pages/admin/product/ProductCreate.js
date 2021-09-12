import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';

import AdminNav from '../../../components/nav/AdminNav';
import { createProduct } from '../../../functions/product';
import { getCategories, getCategorySubs } from '../../../functions/category';
import ProductCreateForm from '../../../components/forms/ProductCreateForm';
import FileUpload from '../../../components/forms/FileUpload';

const initialState = {
  title: '',
  description: '',
  price: '',
  category: '',
  categories: [],
  subs: [],
  shipping: '',
  quantity: '',
  images: [],
  colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
  brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
  color: '',
  brand: '',
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subOptions, setSubOptions] = useState([]);
  const [showSubs, setShowSubs] = useState(false);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setValues({ ...values, categories: res.data });
    } catch (error) {
      console.log('from load categories', error.response);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createProduct(values, user.token);
      // toast.success(`${title} is created`);
      setLoading(false);

      window.alert(`${res.data.title} is created`);
    } catch (error) {
      console.log('Error from create product', error.response);
      setLoading(false);
      toast.error(error.response.data.err);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = async (e) => {
    setValues({ ...values, subs: [], category: e.target.value });
    try {
      const res = await getCategorySubs(e.target.value);
      setSubOptions(res.data);

      setShowSubs(true);
    } catch (error) {
      console.log('From handleCategoryChange', error.response);
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
            <LoadingOutlined className='text-danger h1' />
          ) : (
            <h4>Product Create</h4>
          )}
          <hr />
          <div className='p-3'>
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            setValues={setValues}
            values={values}
            subOptions={subOptions}
            showSubs={showSubs}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
