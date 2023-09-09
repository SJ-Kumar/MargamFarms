import axios from "axios";

export const loadRazorpay = (options, onSuccess, onError) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.success', onSuccess);
      rzp.on('payment.error', onError);
      rzp.open();
    };
    document.body.appendChild(script);
  };
  
  export const initiateRazorpayPayment = (userInfo, orderAmount, onSuccess, onError) => {
    // Replace 'YOUR_KEY_ID' with your actual Razorpay API key
    const key = process.env.KEY_ID;
    
  
    axios.post('/api/orders/create/orderId', { amount: orderAmount }).then((response) => {
      const { orderId } = response.data;
      const options = {
        key: key,
        amount: orderAmount,
        currency: 'INR',
        order_id: orderId,
        name: 'Margam Farms',
        description: 'Order Payment',
        handler: (response) => {
          onSuccess(response);
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.mobile, 
        },
      };
      loadRazorpay(options, onSuccess, onError);
    });
  };
  