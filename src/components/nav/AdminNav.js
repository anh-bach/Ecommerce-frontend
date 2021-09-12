import React from 'react';
import { Link } from 'react-router-dom';

const AdminNav = () => {
  return (
    <div>
      <ul className='nav flex-column'>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/dashboard'>
            Dashboard
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/product'>
            Product
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/products'>
            Products
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/category'>
            Categories
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/sub'>
            Sub Category
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/coupon'>
            Coupon
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/user/password'>
            Password
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminNav;
