import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import HomeScreen from './screens/HomeScreen';
import CODScreen from './screens/CODScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import ProfileScreen from './screens/ProfileScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import CheckoutSuccess from './components/CheckoutSuccess';
import NotFound from './components/NotFound';
import OrderSuccess from './screens/OrderSuccess';
import {HelmetProvider} from 'react-helmet-async'
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import PurchaseListScreen from './screens/admin/PurchaseListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import PurchaseEditScreen from './screens/admin/PurchaseEditScreen';
import BillEditScreen from './screens/admin/BillEditScreen';
import SalaryEditScreen from './screens/admin/SalaryEditScreen';
import TransportEditScreen from './screens/admin/TransportEditScreen';
import ExpenseEditScreen from './screens/admin/ExpenseEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import OilCakeListScreen from './screens/admin/OilCakeListScreen';
import OilCakeEditScreen from './screens/admin/OilCakeEditScreen';
import CurrentOrderListScreen from './screens/admin/CurrentOrdersListScreen';
import Pie from './screens/admin/Pie';
import Line from './screens/admin/Line';
import Dashboard from './screens/admin/Dashboard';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route
        path='/search/:keyword/page/:pageNumber'
        element={<HomeScreen />}
      />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='*' element={<NotFound />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/checkout-success' element={<CheckoutSuccess />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/online/:id' element={<OrderScreen />} />
        <Route path='/order/cod/:id' element={<CODScreen />} />
        <Route path='/order/success/:id' element={<OrderSuccess />} />
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>

      <Route path='' element={<AdminRoute />}>
      <Route path='/admin/dashboard' element={<Dashboard/>} />
        <Route path='/admin/orderlist' element={<OrderListScreen />} />
        <Route path='/admin/currentorderlist' element={<CurrentOrderListScreen />} />
        <Route path='/admin/productlist' element={<ProductListScreen />} />
        <Route path='/admin/oilcakelist' element={<OilCakeListScreen />} />
        <Route path='/admin/productlist/:pageNumber' element={<ProductListScreen />} />
        <Route path='/admin/oilcakelist/:pageNumber' element={<OilCakeListScreen />} />
        <Route path='/admin/purchaseslist' element={<PurchaseListScreen />} />
        <Route path='/admin/purchaseslist/:pageNumber' element={<PurchaseListScreen />} />
        <Route path='/admin/products/:id/edit' element={<ProductEditScreen />} />
        <Route path='/admin/purchases/:id/edit' element={<PurchaseEditScreen />} />
        <Route path='/admin/oilcakes/:id/edit' element={<OilCakeEditScreen />} />
        <Route path='/admin/bills/:id/edit' element={<BillEditScreen />} />
        <Route path='/admin/salarys/:id/edit' element={<SalaryEditScreen />} />
        <Route path='/admin/transports/:id/edit' element={<TransportEditScreen />} />
        <Route path='/admin/expenses/:id/edit' element={<ExpenseEditScreen />} />
        <Route path='/admin/userlist' element={<UserListScreen />} />
        <Route path='/admin/users/:_id/edit' element={<UserEditScreen />} />
        <Route path='/admin/pie' element={<Pie/>} />
        <Route path='/admin/line' element={<Line/>} />
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
