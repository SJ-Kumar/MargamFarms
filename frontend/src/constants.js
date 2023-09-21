// export const BASE_URL =
//   process.env.NODE_ENV === 'develeopment' ? 'http://localhost:5000' : '';
export const BASE_URL = process.env.SERVER_URL; // If using proxy
export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const PURCHASE_URL = '/api/purchases';
export const UPLOADS_URL = '/api/upload';