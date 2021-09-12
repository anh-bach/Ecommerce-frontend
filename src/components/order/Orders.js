import React, { Fragment } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import ShowPaymentInfo from '../cards/ShowPaymentInfo';

const Orders = ({ orders, handleChangeStatus }) => {
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
    <Fragment>
      {orders.map((order) => (
        <div key={order._id} className='row pb-5'>
          <div className='btn btn-block bg-light'>
            <ShowPaymentInfo order={order} showStatus={false} />
            <div className='row'>
              <div className='col-md-4'>Delivery Status</div>
              <div className='col-md-8'>
                <select
                  className='form-control'
                  defaultValue={order.orderStatus}
                  onChange={(e) =>
                    handleChangeStatus(order._id, e.target.value)
                  }
                >
                  <option value='Not Processed'>Not Processed</option>
                  <option value='Cash On Delivery'>Cash On Delivery</option>
                  <option value='Processing'>Processing</option>
                  <option value='Dispatched'>Dispatched</option>
                  <option value='Canceled'>Canceled</option>
                  <option value='Completed'>Completed</option>
                </select>
              </div>
            </div>
          </div>
          {showOrderInTable(order)}
        </div>
      ))}
    </Fragment>
  );
};

export default Orders;
