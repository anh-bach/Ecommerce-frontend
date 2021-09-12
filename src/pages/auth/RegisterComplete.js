import React, { useState, useEffect } from 'react';
import { auth } from './../../firebase';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { LOGGED_IN_USER } from '../../actions/types';
import { createOrUpdateUser } from '../../functions/auth';

const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    //get user email from LS and wait for user to complete registration
    setEmail(window.localStorage.getItem('emailForRegistration'));
  }, []);

  const handleSubmit = async (e) => {
    //send email to firebase
    e.preventDefault();
    //validation
    if (!email || !password) {
      toast.error('Email and password required');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href //data in url from firebase
      );
      //update user password
      if (result.user.emailVerified) {
        //remove user email from localStorage
        window.localStorage.removeItem('emailForRegistration');
        //get user id token
        let user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();
        //send request to server + create user in database + save user in redux store
        const res = await createOrUpdateUser(idTokenResult.token);
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
        //redirect
        history.push('/');
      }
    } catch (error) {
      //handle error
      toast.error(error.message);
      console.log(error);
    }
  };

  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <input type='email' className='form-control' value={email} disabled />
      <input
        type='password'
        className='form-control'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Enter password'
        autoFocus
      />
      <br />
      <button type='submit' className='btn btn-raised'>
        Complete Registration
      </button>
    </form>
  );

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h4>Register</h4>

          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
