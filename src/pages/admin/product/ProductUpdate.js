import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { LoadingOutlined } from '@ant-design/icons';

import AdminNav from '../../../components/nav/AdminNav';
import { getProduct, updateProduct } from '../../../functions/product';
import { getCategories, getCategorySubs } from '../../../functions/category';
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm';
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

const ProductUpdate = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [subOptions, setSubOptions] = useState([]);
  const [arrayOfSubIds, setArrayOfSubIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const user = useSelector((state) => state.user);
  const { slug } = useParams();

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = async () => {
    try {
      setLoading(true);
      //1))load single product
      const res1 = await getProduct(slug);
      setValues({ ...values, ...res1.data });
      //2))load category subs
      const res2 = await getCategorySubs(res1.data.category._id);
      setSubOptions(res2.data);
      setLoading(false);
      //3)) prepare array of sub ids to show as default subs value in ant densign select
      let arr = [];
      res1.data.subs.map((sub) => arr.push(sub._id));
      setArrayOfSubIds((prev) => arr);
    } catch (error) {
      console.log('From Product update load product', error.response);
    }
  };

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
      values.subs = arrayOfSubIds;
      values.category = selectedCategory || values.category;

      const res = await updateProduct(slug, values, user.token);
      setLoading(false);
      toast.success(`${res.data.title} is updated.`);
      history.push('/admin/products');
    } catch (error) {
      console.log('from update product', error.response);
      setLoading(false);
      toast.error(error.response.data.err);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = async (e) => {
    setValues({ ...values, subs: [] });
    setSelectedCategory(e.target.value);
    //array for antd subs select

    try {
      const res = await getCategorySubs(e.target.value);
      setSubOptions(res.data);
      //if user click back to the original category, re-populate the initial subs
      if (values.category._id === e.target.value) {
        loadProduct();
      }
      setArrayOfSubIds([]);
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
          {' '}
          {loading ? (
            <LoadingOutlined className='text-danger h1' />
          ) : (
            <h4>Product Update</h4>
          )}
          <hr />
          <div className='p-3'>
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <ProductUpdateForm
            values={values}
            setValues={setValues}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            subOptions={subOptions}
            arrayOfSubIds={arrayOfSubIds}
            setArrayOfSubIds={setArrayOfSubIds}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
