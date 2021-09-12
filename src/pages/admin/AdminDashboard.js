import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import AdminNav from '../../components/nav/AdminNav';
import { changeStatus, getOrders } from '../../functions/admin';
import Orders from '../../components/order/Orders';

const AdminDashboard = () => {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders(user.token);
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.log('From load Orders', error);
    }
  };

  const handleChangeStatus = async (orderId, orderStatus) => {
    try {
      setLoading(true);
      await changeStatus(user.token, orderId, orderStatus);
      await loadOrders();
      toast.success('Status Updated');
      setLoading(false);
    } catch (error) {
      console.log('From change order status', error);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>

        <div className='col-md-10'>
          {loading ? (
            <h4 className='text-danger'>Loading...</h4>
          ) : (
            <h4>Admin Dashboard</h4>
          )}
          <Orders orders={orders} handleChangeStatus={handleChangeStatus} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
