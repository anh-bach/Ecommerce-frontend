import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from 'antd/lib/menu';
import Badge from 'antd/lib/badge';
import {
  AppstoreOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import firebase from 'firebase';
import { LOGOUT } from '../../actions/types';
import Search from '../forms/Search';

const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState('home');
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state) => state);
  const history = useHistory();

  const handleClick = (e) => {
    setCurrent(e.key);
  };
  //logout
  const logout = () => {
    firebase.auth().signOut();
    //update state
    dispatch({
      type: LOGOUT,
      payload: null,
    });
    history.push('/login');
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode='horizontal'>
      <Item key='home' icon={<AppstoreOutlined />}>
        <Link to='/'>Home</Link>
      </Item>

      <Item key='shop' icon={<ShoppingOutlined />}>
        <Link to='/shop'>Shop</Link>
      </Item>

      <Item key='cart' icon={<ShoppingCartOutlined />}>
        <Link to='/cart'>
          <Badge count={cart.length} offset={[11, 1]}>
            Cart
          </Badge>
        </Link>
      </Item>

      {!user && (
        <Fragment>
          <Item
            className='float-right'
            key='register'
            icon={<UserAddOutlined />}
          >
            <Link to='/register'>Register</Link>
          </Item>
          <Item className='float-right' key='login' icon={<UserOutlined />}>
            <Link to='/login'>Login</Link>
          </Item>
        </Fragment>
      )}

      {user && (
        <SubMenu
          key='SubMenu'
          icon={<SettingOutlined />}
          title={user.email && user.email.split('@')[0]}
          className='float-right'
        >
          {user && user.role === 'subscriber' && (
            <Item>
              <Link to='/user/history'>Dashboard</Link>
            </Item>
          )}
          {user && user.role === 'admin' && (
            <Item>
              <Link to='/admin/dashboard'>Dashboard</Link>
            </Item>
          )}

          <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Item>
        </SubMenu>
      )}

      <span className='float-right p-1'>
        <Search />
      </span>
    </Menu>
  );
};

export default Header;
