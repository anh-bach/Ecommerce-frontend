import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import Avatar from 'antd/lib/avatar';
import Badge from 'antd/lib/badge';

const FileUpload = ({ values, setValues, setLoading }) => {
  const user = useSelector((state) => state.user);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        720,
        720,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64'
      );
    });

  const fileUploadAndResize = async (e) => {
    //resize
    let files = e.target.files;
    let allUploadedFiles = values.images;
    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        try {
          // Resizer.imageFileResizer(files[i], 720, 720, 'JPEG', 100, 0, (uri) => {}, 'base64')
          const image = await resizeFile(files[i]);
          const res = await axios.post(
            `${process.env.REACT_APP_API}/uploadimages`,
            { image },
            {
              headers: {
                authtoken: user ? user.token : '',
              },
            }
          );
          allUploadedFiles.push(res.data);
          setValues({ ...values, images: allUploadedFiles });
        } catch (error) {
          console.log('From upload files', error.response);
          setLoading(false);
        }
      }
      setLoading(false);
    }
    //send to server to upload to cloudinary
    //set url to images[] in parent component - ProductCreate
  };

  const handleImageRemove = async (public_id) => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/removeimage`,
        { public_id },
        {
          headers: {
            authtoken: user ? user.token : '',
          },
        }
      );

      let { images } = values;
      images = images.filter((image) => image.public_id !== public_id);
      setValues({ ...values, images });

      setLoading(false);
    } catch (error) {
      console.log('From remove image', error.response);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      {values.images.length > 0 && (
        <div className='row'>
          {values.images.map((image) => (
            <Badge
              key={image.public_id}
              count='x'
              onClick={() => handleImageRemove(image.public_id)}
              style={{ cursor: 'pointer' }}
            >
              <Avatar
                src={image.url}
                size={100}
                shape='square'
                className='ml-3'
              />
            </Badge>
          ))}
        </div>
      )}
      <div className='row'>
        <label className='btn btn-primary btn-raised mt-3'>
          Choose File
          <input
            type='file'
            multiple
            accept='images/*'
            hidden
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </Fragment>
  );
};

export default FileUpload;
