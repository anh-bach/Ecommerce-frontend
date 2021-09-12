import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DeleteOutlined } from '@ant-design/icons';

import {
  getCoupons,
  createCoupon,
  removeCoupon,
} from '../../../functions/coupon';
import AdminNav from '../../../components/nav/AdminNav';

const CouponCreatePage = () => {
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState(new Date());
  const [discount, setDiscount] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    const res = await getCoupons();
    setCoupons(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //create coupon
    try {
      setLoading(true);
      const res = await createCoupon({ name, expiry, discount }, user.token);
      setName('');
      setDiscount('');
      setExpiry(new Date());
      setCoupons([res.data, ...coupons]);
      setLoading(false);
      toast.success(`${res.data.name} coupon is created`);
    } catch (error) {
      toast.error(error.response.data.err);
      console.log('From create coupon', error.response);
    }
  };

  const handleRemove = async (couponId) => {
    if (window.confirm('Delete The Coupon?')) {
      try {
        setLoading(true);
        const res = await removeCoupon(couponId, user.token);
        await loadCoupons();
        setLoading(false);
        toast.error(`Coupon ${res.data.name} deleted`);
      } catch (error) {
        console.log('From handle remove coupon', error);
      }
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
            <h4>Coupons</h4>
          )}

          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label className='text-muted'>Name</label>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
              />
            </div>
            <div className='form-group'>
              <label className='text-muted'>Discount %</label>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                required
              />
            </div>
            <div className='form-group'>
              <label className='text-muted'>Expiry</label>
              <br />
              <DatePicker
                className='form-control'
                selected={expiry}
                value={expiry}
                onChange={(date) => setExpiry(date)}
                required
              />
            </div>
            <button className='btn btn-outline-primary'>Save</button>
          </form>
          <br />
          <h4>{coupons.length} Coupons</h4>

          <table className='table table-bordered'>
            <thead className='thead-light'>
              <tr>
                <th scope='col'>Name</th>
                <th scope='col'>Expiry</th>
                <th scope='col'>Discount</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 &&
                coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td>{coupon.name}</td>
                    <td>{new Date(coupon.expiry).toLocaleDateString()}</td>
                    <td>{coupon.discount}</td>
                    <td>
                      <DeleteOutlined
                        className='text-danger'
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemove(coupon._id)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponCreatePage;
