import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Menu from 'antd/lib/menu';
import Slider from 'antd/lib/slider';
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from '@ant-design/icons';
import Checkbox from 'antd/lib/checkbox';
import Radio from 'antd/lib/radio';

import {
  fetchProductsByFilter,
  getProductsByCount,
} from '../functions/product';
import { getCategories } from '../functions/category';
import { getSubs } from '../functions/sub';
import ProductCard from '../components/cards/ProductCard';
import { SEARCH_QUERY } from '../actions/types';
import Star from '../components/forms/Star';

const { SubMenu } = Menu;

const Shop = () => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search);
  let { text } = search;
  const [products, setProducts] = useState([]);
  const [price, setPrice] = useState([0, 9999]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState('');
  const [brands, setBrands] = useState([
    'Apple',
    'Samsung',
    'Microsoft',
    'Lenovo',
    'ASUS',
  ]);
  const [brand, setBrand] = useState('');
  const [colors, setColors] = useState([
    'Black',
    'Brown',
    'Silver',
    'White',
    'Blue',
  ]);
  const [color, setColor] = useState('');
  const [shippings, setShippings] = useState(['Yes', 'No']);
  const [shipping, setShipping] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState('');
  //1)).load products on page load by default
  useEffect(() => {
    loadAllProducts();
    loadCategories();
    loadSubs();
  }, []);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const res = await getProductsByCount(12);
      setProducts(res.data);

      setLoading(false);
    } catch (error) {
      console.log('From Shop - load all products default', error);
    }
  };

  //2)) Load products on user search input
  useEffect(() => {
    //if search is empty, get all products
    if (!text) {
      return loadAllProducts();
    }

    //user enters search
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
    }, 500);

    return () => clearTimeout(delayed);
  }, [text]);

  //3))search on price slider
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ price });
    }, 500);

    return () => clearTimeout(delayed);
  }, [price]);
  // Load products on user input
  const fetchProducts = async (arg) => {
    try {
      const res = await fetchProductsByFilter(arg);

      setProducts(res.data);
    } catch (error) {
      console.log('From Shop - fetch products default', error);
    }
  };

  const handleSlider = (value) => {
    //clear other state first
    dispatch({ type: SEARCH_QUERY, payload: { text: '' } });
    setSelectedCategories([]);
    setStars('');
    setSub('');
    setBrand('');
    setColor('');
    setShipping('');

    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  //4))Search on product category
  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.log('From loadcatgories Shop.js', error);
    }
  };

  const handleCheck = async (e) => {
    try {
      //clear other state
      dispatch({ type: SEARCH_QUERY, payload: { text: '' } });
      setStars('');
      setSub('');
      setBrand('');
      setColor('');
      setShipping('');
      // setPrice([0, 0]);
      //hanlde selectedCategories check and avoid duplicated categories in the state
      let inTheState = [...selectedCategories];
      let justChecked = e.target.value;
      let foundInTheState = inTheState.indexOf(justChecked);
      foundInTheState < 0
        ? inTheState.push(justChecked)
        : inTheState.splice(foundInTheState, 1);
      setSelectedCategories(inTheState);

      //if there is no categories selected, load all products
      if (inTheState.length === 0) {
        return loadAllProducts();
      }
      await fetchProducts({ category: inTheState });
    } catch (error) {
      console.log('From handle check categories Shop.js', error);
    }
  };

  const showCategories = () =>
    categories.map((category) => (
      <div key={category._id}>
        <Checkbox
          className='pb-2 pl-4 pr-4'
          value={category._id}
          onChange={handleCheck}
          name='category'
          checked={selectedCategories.includes(category._id)}
        >
          {category.name}
        </Checkbox>
      </div>
    ));

  //5)) show products by star ratings
  const showStars = () => (
    <div className='pr-4 pl-4 pb-2'>
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  const handleStarClick = async (numberOfStars) => {
    try {
      //when user click stars - reset other states
      dispatch({ type: SEARCH_QUERY, payload: { text: '' } });
      // setPrice([0, 9999]);
      setSelectedCategories([]);
      setSub('');
      setBrand('');
      setColor('');
      setShipping('');

      setStars(numberOfStars);
      await fetchProducts({ stars: numberOfStars });
    } catch (error) {
      console.log('From handle star clicks Shop.js', error);
    }
  };

  //6)) Filter on subs categories
  const loadSubs = async () => {
    try {
      const res = await getSubs();
      setSubs(res.data);
    } catch (error) {
      console.log('From load sub catgories Shop.js', error);
    }
  };

  const handleSubClick = async (sub) => {
    try {
      //when user click stars - reset other states
      dispatch({ type: SEARCH_QUERY, payload: { text: '' } });
      // setPrice([0, 9999]);
      setSelectedCategories([]);
      setStars('');
      setBrand('');
      setColor('');
      setShipping('');

      setSub(sub);
      await fetchProducts({ sub });
    } catch (error) {
      console.log('From handle sub clicks Shop.js', error);
    }
  };

  const showSubs = () =>
    subs.map((sub) => (
      <div
        className='p-1 m-1 badge badge-secondary'
        style={{ cursor: 'pointer' }}
        key={sub._id}
        onClick={() => handleSubClick(sub._id)}
      >
        {sub.name}
      </div>
    ));

  //7))filter on brands
  const showBrands = () =>
    brands.map((item) => (
      <Radio
        key={item}
        value={item}
        name={item}
        checked={item === brand}
        onChange={handleBrand}
        className='pb-1 pl-1 pr-4'
      >
        {item}
      </Radio>
    ));

  const handleBrand = async (e) => {
    //clear other state
    try {
      //when user click stars - reset other states
      dispatch({ type: SEARCH_QUERY, payload: { text: '' } });
      // setPrice([0, 9999]);
      setSelectedCategories([]);
      setStars('');
      setSub('');
      setColor('');
      setShipping('');

      setBrand(e.target.value);
      await fetchProducts({ brand: e.target.value });
    } catch (error) {
      console.log('From handle brand clicks Shop.js', error);
    }
  };

  //8))filter on colors
  const showColors = () =>
    colors.map((item) => (
      <Radio
        key={item}
        value={item}
        name={item}
        checked={item === color}
        onChange={handleColor}
        className='pb-1 pl-1 pr-4'
      >
        {item}
      </Radio>
    ));

  const handleColor = async (e) => {
    //clear other state
    try {
      //when user click stars - reset other states
      dispatch({ type: SEARCH_QUERY, payload: { text: '' } });
      // setPrice([0, 9999]);
      setSelectedCategories([]);
      setStars('');
      setSub('');
      setBrand('');
      setShipping('');

      setColor(e.target.value);
      await fetchProducts({ color: e.target.value });
    } catch (error) {
      console.log('From handle color clicks Shop.js', error);
    }
  };

  //9)) filter on shipping
  const showShippings = () =>
    shippings.map((item) => (
      <Radio
        key={item}
        value={item}
        name={item}
        checked={item === shipping}
        onChange={handleShipping}
        className='pb-1 pl-1 pr-4'
      >
        {item}
      </Radio>
    ));

  const handleShipping = async (e) => {
    //clear other state
    try {
      //when user click stars - reset other states
      dispatch({ type: SEARCH_QUERY, payload: { text: '' } });
      // setPrice([0, 9999]);
      setSelectedCategories([]);
      setStars('');
      setSub('');
      setBrand('');
      setColor('');

      setShipping(e.target.value);
      await fetchProducts({ shipping: e.target.value });
    } catch (error) {
      console.log('From handle shipping clicks Shop.js', error);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3 pt-2'>
          <h4>Search/Filter</h4>
          <Menu
            mode='inline'
            defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']}
          >
            {/* Price Range */}
            <SubMenu
              key='1'
              title={
                <span className='h6'>
                  <DollarOutlined /> Price
                </span>
              }
            >
              <div>
                <Slider
                  className='mx-4'
                  tipFormatter={(value) => `$${value}`}
                  range
                  max='9999'
                  value={price}
                  onChange={(value) => handleSlider(value)}
                />
              </div>
            </SubMenu>
            {/* categories */}
            <SubMenu
              key='2'
              title={
                <span className='h6'>
                  <DownSquareOutlined /> Categories
                </span>
              }
            >
              <div>{categories.length > 0 && showCategories()}</div>
            </SubMenu>
            {/* stars rating */}
            <SubMenu
              key='3'
              title={
                <span className='h6'>
                  <StarOutlined /> Ratings
                </span>
              }
            >
              <div>{showStars()}</div>
            </SubMenu>
            {/*sub categories */}
            <SubMenu
              key='4'
              title={
                <span className='h6'>
                  <DownSquareOutlined /> Sub Categories
                </span>
              }
            >
              <div>{subs.length > 0 && showSubs()}</div>
            </SubMenu>
            {/*brand */}
            <SubMenu
              key='5'
              title={
                <span className='h6'>
                  <DownSquareOutlined /> Brands
                </span>
              }
            >
              <div>{brands.length > 0 && showBrands()}</div>
            </SubMenu>
            {/*color */}
            <SubMenu
              key='6'
              title={
                <span className='h6'>
                  <DownSquareOutlined /> Colors
                </span>
              }
            >
              <div>{colors.length > 0 && showColors()}</div>
            </SubMenu>
            {/*shipping */}
            <SubMenu
              key='7'
              title={
                <span className='h6'>
                  <DownSquareOutlined /> Shipping
                </span>
              }
            >
              <div>{shippings.length > 0 && showShippings()}</div>
            </SubMenu>
          </Menu>
        </div>

        <div className='col-md-9 pt-2'>
          {loading ? (
            <h4 className='text-danger'>Loading...</h4>
          ) : (
            <h4 className='text-danger'>Products</h4>
          )}

          {products.length < 1 && <p>No products found.</p>}
          {products.length && (
            <div className='row'>
              {products.map((product) => (
                <div key={product._id} className='col-md-4 mt-3'>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
