import axios from 'axios';

export const createOrUpdateUser = async (authtoken) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_API}/create-or-update-user`,
      {},
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const currentUser = async (authtoken) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_API}/current-user`,
      {},
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const currentAdmin = async (authtoken) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_API}/current-admin`,
      {},
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
