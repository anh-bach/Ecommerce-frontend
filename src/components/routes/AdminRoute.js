import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { currentAdmin } from '../../functions/auth';

import LoadingToRedirect from './LoadingToRedirect';

const AdminRoute = ({ ...rest }) => {
  const user = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      //   currentAdmin(user.token)
      //     .then((res) => {
      //       setOk(true);
      //     })
      //     .catch((err) => {
      //         console.log(err)
      //         setOk(false);
      //     });

      user.role === 'admin' ? setOk(true) : setOk(false);
    }
  }, [user]);

  return ok ? <Route {...rest} /> : <LoadingToRedirect />;
};

export default AdminRoute;
