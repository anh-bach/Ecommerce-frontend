import axios from 'axios';

export const userCart = async (cart, authToken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/cart`,
    { cart },
    {
      headers: { authToken },
    }
  );
};

export const getUserCart = async (authToken) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/cart`, {
    headers: { authToken },
  });
};

export const emptyUserCart = async (authToken) => {
  return await axios.delete(`${process.env.REACT_APP_API}/user/cart`, {
    headers: { authToken },
  });
};

export const saveUserAddress = async (authToken, address) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/address`,
    { address },
    {
      headers: { authToken },
    }
  );
};

export const applyCoupon = async (authToken, coupon) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/cart/coupon`,
    { coupon },
    {
      headers: { authToken },
    }
  );
};

export const createOrder = async (authToken, stripeResponse) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/order`,
    { stripeResponse },
    {
      headers: { authToken },
    }
  );
};

export const createCashOrderForUser = async (authToken, COD, coupon) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/cash-order`,
    { COD, couponApplied: coupon },
    {
      headers: { authToken },
    }
  );
};

export const getUserOrders = async (authToken) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/orders`, {
    headers: { authToken },
  });
};

export const getWishlist = async (authToken) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/wishlist`, {
    headers: { authToken },
  });
};

export const addWishlist = async (authToken, productId) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/wishlist`,
    { productId },
    {
      headers: { authToken },
    }
  );
};

export const removeWishlist = async (authToken, productId) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/user/wishlist/${productId}`,
    {},
    {
      headers: { authToken },
    }
  );
};
