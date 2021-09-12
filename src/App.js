import React, { Fragment, useEffect, lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';

import './App.css';
import { auth } from './firebase';
import { LOGGED_IN_USER } from './actions/types';
import { currentUser } from './functions/auth';
import { LoadingOutlined } from '@ant-design/icons';

//Using lazy to import components
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Home = lazy(() => import('./pages/Home'));
const Header = lazy(() => import('./components/nav/Header'));
const RegisterComplete = lazy(() => import('./pages/auth/RegisterComplete'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const History = lazy(() => import('./pages/user/History'));
const UserRoute = lazy(() => import('./components/routes/UserRoute'));
const AdminRoute = lazy(() => import('./components/routes/AdminRoute'));
const Wishlist = lazy(() => import('./pages/user/WishList'));
const Password = lazy(() => import('./pages/user/Password'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CategoryCreate = lazy(() =>
  import('./pages/admin/category/CategoryCreate')
);
const CategoryUpdate = lazy(() =>
  import('./pages/admin/category/CategoryUpdate')
);
const SubCreate = lazy(() => import('./pages/admin/sub/SubCreate'));
const SubUpdate = lazy(() => import('./pages/admin/sub/SubUpdate'));
const ProductCreate = lazy(() => import('./pages/admin/product/ProductCreate'));
const AllProducts = lazy(() => import('./pages/admin/product/AllProducts'));
const ProductUpdate = lazy(() => import('./pages/admin/product/ProductUpdate'));
const Product = lazy(() => import('./pages/Product'));
const CategoryHome = lazy(() => import('./pages/category/CategoryHome'));
const SubHome = lazy(() => import('./pages/sub/SubHome'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const SideDrawer = lazy(() => import('./components/drawer/SideDrawer'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CouponCreatePage = lazy(() =>
  import('./pages/admin/coupon/CouponCreate')
);
const Payment = lazy(() => import('./pages/Payment'));

const App = () => {
  const dispatch = useDispatch();
  //check firebase auth state for current logged in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          //sending token to backend to check for currentUser, get data and save it in redux store
          const res = await currentUser(idTokenResult.token);
          //update global store
          dispatch({
            type: LOGGED_IN_USER,
            payload: {
              name: res.data.name,
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
    //clean up
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <div className='col text-center p-5'>
          __ECAREACT
          <LoadingOutlined />
          __
        </div>
      }
    >
      <Header />
      <ToastContainer />
      <SideDrawer />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/register/complete' component={RegisterComplete} />
        <Route exact path='/forgot/password' component={ForgotPassword} />
        <Route exact path='/product/:slug' component={Product} />
        <Route exact path='/category/:slug' component={CategoryHome} />
        <Route exact path='/sub/:slug' component={SubHome} />
        <Route exact path='/shop' component={Shop} />
        <Route exact path='/cart' component={Cart} />
        <Route exact path='/checkout' component={Checkout} />
        <Route exact path='/payment' component={Payment} />

        {/* LoggedIn User route */}
        <UserRoute exact path='/user/history' component={History} />
        <UserRoute exact path='/user/password' component={Password} />
        <UserRoute exact path='/user/wishlist' component={Wishlist} />
        {/* for AdminRoute */}
        <AdminRoute exact path='/admin/dashboard' component={AdminDashboard} />
        <AdminRoute exact path='/admin/category' component={CategoryCreate} />
        <AdminRoute
          exact
          path='/admin/category/:slug'
          component={CategoryUpdate}
        />
        <AdminRoute exact path='/admin/sub' component={SubCreate} />
        <AdminRoute exact path='/admin/sub/:slug' component={SubUpdate} />
        <AdminRoute exact path='/admin/product' component={ProductCreate} />
        <AdminRoute exact path='/admin/products' component={AllProducts} />
        <AdminRoute
          exact
          path='/admin/product/:slug'
          component={ProductUpdate}
        />
        <AdminRoute exact path='/admin/coupon' component={CouponCreatePage} />
      </Switch>
    </Suspense>
  );
};

export default App;
