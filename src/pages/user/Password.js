import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';

import UserNav from '../../components/nav/UserNav';

const Password = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.currentUser.updatePassword(password);
      toast.success('Password updated');

      setLoading(false);
      setPassword('');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const passwordUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label htmlFor='password'>Your Password</label>
        <input
          type='password'
          className='form-control'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter your new password'
          autoFocus
          disabled={loading}
        />
      </div>
      <button
        type='submit'
        className='btn btn-primary'
        disabled={password.length < 6 || loading}
      >
        Submit
      </button>
    </form>
  );

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <UserNav />
        </div>
        <div className='col-md-10'>
          {loading ? (
            <h4 className='text-danger'>loading</h4>
          ) : (
            <h4>Password Update</h4>
          )}
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  );
};

export default Password;
