import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Button from 'antd/lib/button';
import {
  MailOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  auth,
  googleAuthProvider,
  facebookAuthProvider,
} from './../../firebase';
import { LOGGED_IN_USER } from '../../actions/types';
import { createOrUpdateUser } from '../../functions/auth';

const Login = ({ location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  //redirect base on user role
  const roleBasedRedirect = (res) => {
    //check if intended path from history location state
    let intended = location.state;

    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === 'admin') {
        history.push('/admin/dashboard');
      } else {
        history.push('/user/history');
      }
    }
  };

  const user = useSelector((state) => state.user);
  //check logged in user
  useEffect(() => {
    if (user && user.token) history.push('/');
  }, [user, history]);

  //1))submit form login
  const handleSubmit = async (e) => {
    e.preventDefault();
    //loading
    setLoading(true);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      //sending token to backend and save user data in database
      const res = await createOrUpdateUser(idTokenResult.token);
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
      //redirect base on user roles
      roleBasedRedirect(res);
    } catch (error) {
      //
      console.log(error);
      toast.error(error.message);
      //loading
      setLoading(false);
    }
  };
  //Google login
  const googleLogin = async () => {
    //
    try {
      const result = await auth.signInWithPopup(googleAuthProvider);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      //sending token to backend and save user data in database
      const res = await createOrUpdateUser(idTokenResult.token);
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
      roleBasedRedirect(res);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      //loading
      setLoading(false);
    }
  };

  //facebook login
  const facebookLogin = async () => {
    try {
      const result = await auth.signInWithPopup(facebookAuthProvider);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      //sending token to backend and save user data in database
      const res = await createOrUpdateUser(idTokenResult.token);
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
      history.push('/');
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        //handle existing email error
        var pendingCred = error.credential;
        var email = error.email;
        const methods = await auth.fetchSignInMethodsForEmail(email);

        if (methods[0] === 'password') {
          try {
            const password = prompt('Enter your password');
            const result = await auth.signInWithEmailAndPassword(
              email,
              password
            );
            await result.user.linkWithCredential(pendingCred);
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();
            //sending token to backend and save user data in database
            const res = await createOrUpdateUser(idTokenResult.token);
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
            roleBasedRedirect(res);
            return;
          } catch (error) {
            console.log(error);
            toast.error(error.message);
            //loading
            setLoading(false);
          }
        }
      }

      console.log(error);
      toast.error(error.message);
      //loading
      setLoading(false);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='email'
          className='form-control'
          placeholder='Your email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </div>
      <div className='form-group'>
        <input
          type='password'
          className='form-control'
          placeholder='Your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        onClick={handleSubmit}
        type='primary'
        className='mb-3'
        block
        shape='round'
        icon={<MailOutlined />}
        size='large'
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          {!loading ? (
            <h4>Login</h4>
          ) : (
            <h4 className='text-danger'>Loading...</h4>
          )}
          {loginForm()}
          <Button
            onClick={googleLogin}
            type='danger'
            className='mb-3'
            block
            shape='round'
            icon={<GoogleOutlined />}
            size='large'
          >
            Login with Google
          </Button>
          <Button
            onClick={facebookLogin}
            type='primary'
            className='mb-3'
            block
            shape='round'
            icon={<FacebookOutlined />}
            size='large'
          >
            Login with Facebook
          </Button>
          <Link to='/forgot/password' className='float-right text-danger'>
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
