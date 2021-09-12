import React from 'react';
import Card from 'antd/lib/card';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import laptop from '../../images/laptop.png';
const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {
  const { title, images, description, slug } = product;

  return (
    <Card
      cover={
        <img
          src={images && images.length > 0 ? images[0].url : laptop}
          alt='product'
        />
      }
      style={{ objectFit: 'cover' }}
      className='p-1'
      actions={[
        <Link to={`/admin/product/${slug}`}>
          <EditOutlined className='text-warning' />
        </Link>,
        <DeleteOutlined
          className='text-danger'
          onClick={() => handleRemove(slug)}
        />,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 30)}...`}
      />
    </Card>
  );
};

export default AdminProductCard;
