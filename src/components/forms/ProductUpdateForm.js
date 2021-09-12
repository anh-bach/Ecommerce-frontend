import React from 'react';
import Select from 'antd/lib/select';

const { Option } = Select;

const ProductUpdateForm = ({
  handleSubmit,
  handleChange,
  values,
  setValues,
  handleCategoryChange,
  categories,
  subOptions,
  arrayOfSubIds,
  setArrayOfSubIds,
  selectedCategory,
}) => {
  const {
    title,
    description,
    price,
    category,
    shipping,
    quantity,
    colors,
    brands,
    color,
    brand,
  } = values;

  return (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label>Title</label>
        <input
          className='form-control'
          type='text'
          name='title'
          value={title}
          onChange={handleChange}
        />
      </div>
      <div className='form-group'>
        <label>Description</label>
        <input
          className='form-control'
          type='text'
          name='description'
          value={description}
          onChange={handleChange}
        />
      </div>
      <div className='form-group'>
        <label>Price</label>
        <input
          className='form-control'
          type='number'
          name='price'
          value={price}
          onChange={handleChange}
        />
      </div>
      <div className='form-group'>
        <label>Shipping</label>
        <select
          name='shipping'
          className='form-control'
          onChange={handleChange}
          value={shipping}
        >
          <option value=''>Please select</option>
          <option value='Yes'>Yes</option>
          <option value='No'>No</option>
        </select>
      </div>
      <div className='form-group'>
        <label>Quantity</label>
        <input
          className='form-control'
          type='number'
          name='quantity'
          value={quantity}
          onChange={handleChange}
        />
      </div>
      <div className='form-group'>
        <label>Color</label>
        <select
          name='color'
          className='form-control'
          onChange={handleChange}
          value={color}
        >
          <option value=''>Please select</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
      <div className='form-group'>
        <label>Brand</label>
        <select
          name='brand'
          className='form-control'
          onChange={handleChange}
          value={brand}
        >
          <option value=''>Please select</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className='form-group'>
        <label>Category</label>
        <select
          className='form-control'
          name='category'
          onChange={handleCategoryChange}
          value={selectedCategory || category._id}
          required
        >
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>

      <div className='form-group'>
        <label>Sub categories</label>
        <Select
          mode='multiple'
          style={{ width: '100%' }}
          placeholder='Please select'
          value={arrayOfSubIds}
          onChange={(value) => setArrayOfSubIds(value)}
        >
          {subOptions.length &&
            subOptions.map((sub) => (
              <Option key={sub._id} value={sub._id}>
                {sub.name}
              </Option>
            ))}
        </Select>
      </div>

      <button className='btn btn-outline-info'>Save</button>
    </form>
  );
};

export default ProductUpdateForm;
