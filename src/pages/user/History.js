import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { PDFDownloadLink } from '@react-pdf/renderer';

import Invoice from '../../components/order/Invoice';
import UserNav from '../../components/nav/UserNav';
import { getUserOrders } from '../../functions/user';
import ShowPaymentInfo from '../../components/cards/ShowPaymentInfo';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getUserOrders(user.token);
      setOrders(res.data.userOrders);
      setLoading(false);
    } catch (error) {
      console.log('from load user orders', error);
      setLoading(false);
    }
  };

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      className='btn btn-sm btn-block btn-outline-primary'
      document={<Invoice order={order} />}
      fileName='invoice.pdf'
    >
      Download PDF
    </PDFDownloadLink>
  );

  const showEachOrder = () =>
    orders.map((order, index) => (
      <div key={index} className='m-5 p-3 card'>
        <ShowPaymentInfo order={order} />
        {showOrderInTable(order)}
        <div className='row'>
          <div className='col'>{showDownloadLink(order)}</div>
        </div>
      </div>
    ));

  const showOrderInTable = (order) => (
    <table className='table table-bordered'>
      <thead className='thead-light'>
        <tr>
          <th scope='col'>Title</th>
          <th scope='col'>Price</th>
          <th scope='col'>Brand</th>
          <th scope='col'>Color</th>
          <th scope='col'>Count</th>
          <th scope='col'>Shipping</th>
        </tr>
      </thead>
      <tbody>
        {order.products.map((item, index) => (
          <tr key={index}>
            <td>
              <b>{item.product.title}</b>
            </td>
            <td>{item.product.price}</td>
            <td>{item.product.brand}</td>
            <td>{item.color}</td>
            <td>{item.count}</td>
            <td>
              {item.product.shipping === 'Yes' ? (
                <CheckCircleOutlined className='text-success' />
              ) : (
                <CloseCircleOutlined className='text-danger' />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className='container-fluid'>
      <div className='row mt-2'>
        <div className='col-md-2'>
          <UserNav />
        </div>
        <div className='col-md-10 text-center'>
          <h4>
            {orders.length > 0 ? 'User Purchase Orders' : 'No Purchase Orders'}
            {orders.length > 0 && showEachOrder()}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default History;
