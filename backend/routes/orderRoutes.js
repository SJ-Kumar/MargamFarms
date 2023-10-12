import express from 'express';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
const router = express.Router();
import {
  getProductSales,
  createRazorpayOrder,
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getRevenueByProduct,
  getRecentOrders,
  getCurrentOrders,
  getTotalOrdersYear,
} from '../controllers/orderController.js';
import Order from '../models/orderModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.route('/product-sales').post(protect,admin,getProductSales);
router.route('/linechart-sales').get(protect,admin,getRevenueByProduct);
router.route('/recent').get(protect,admin,getRecentOrders);
router.route('/total-orders').get(protect,admin,getTotalOrdersYear);
router.route('/current-orders').get(protect,admin,getCurrentOrders);
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

router.route('/create/orderId').post(protect, createRazorpayOrder);
router.post('/send-order-confirmation/orderId', protect, async (req, res) => {
    //const { orderId } = req.params;
    const { orderId, userEmail,userName,address,city,Location,postal, orderItems,itemsprice,shippingprice, totalPrice, paymentmethod } = req.body; // Data sent from the frontend
    //console.log("User email id is",userEmail);
    //const itemImageUrls = orderItems.map(item => item.image);
    //console.log("Image URL - ", itemImageUrls);
    // Create the order items list from the JSON string
    //const parsedOrderItems = JSON.parse(orderItems);
    //const itemImageUrls = orderItems.map(item => item.image);
    function getImageUrl(itemImage) {
      switch (itemImage) {
        case '/uploads\\image-1695536924285.jpeg':
          return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/37c65a67-738e-4e97-9bb2-82699ea41cbe/1536x2048.jpg';
        case '/images/coco.jpg':
          return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/04470062-0230-48a4-bc79-b024ab762f30/1144x1536.jpg';
        case '/uploads\\image-1695536908410.jpg':
          return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/710d7fa3-ac9c-4e43-b4df-48e17d70807c/3472x4640.jpg';
        case '/images/grnd.jpg':
          return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/ab28d78f-65c8-450c-ba2e-b4828153a583/1536x2048.jpg';
        case '/uploads\\image-1695536936478.jpeg':
          return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/e585d90d-fd16-46df-ab36-c35ec9b59689/1200x1599.jpg';
        case '/uploads\\image-1693204057779.jpg':
          return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/7bdfe2f6-4bfb-44e1-9aa6-f14f8b74e4d7/1536x2048.jpg';
        case '/uploads\\image-1693214629899.jpg':
          return ' http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/ac6ba859-f554-404d-a575-cd5e7709a97e/3456x4608.jpg';
        case '/uploads\\image-1696342768349.jpg':
          return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/a7c158ba-b4b1-4a1f-8faf-2ffa4aeafb81/579x819.jpg';
        case '/uploads\\image-1695537154168.jpg':
          return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/b2e02a9f-8b94-431a-a7b2-d0f65ca771a1/1200x1600.jpg';
          default:
          return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/73ee1c46-f0ae-4829-a5a8-ec4a5cd8a2bb/512x512.png';
      }
    }

    

    // Customize your email template here
    const emailContent = {
      to: userEmail,
      from: 'margamfarm@gmail.com', // Replace with your email
      subject: 'Order Confirmation',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
            <!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=Edge">
            <!--<![endif]-->
            <!--[if (gte mso 9)|(IE)]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <!--[if (gte mso 9)|(IE)]>
        <style type="text/css">
          body {width: 600px;margin: 0 auto;}
          table {border-collapse: collapse;}
          table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
          img {-ms-interpolation-mode: bicubic;}
        </style>
      <![endif]-->
            <style type="text/css">
          body, p, div {
            font-family: inherit;
            font-size: 14px;
          }
          body {
            color: #000000;
          }
          body a {
            color: #1188E6;
            text-decoration: none;
          }
          p { margin: 0; padding: 0; }
          table.wrapper {
            width:100% !important;
            table-layout: fixed;
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          img.max-width {
            max-width: 100% !important;
          }
          .column.of-2 {
            width: 50%;
          }
          .column.of-3 {
            width: 33.333%;
          }
          .column.of-4 {
            width: 25%;
          }
          ul ul ul ul  {
            list-style-type: disc !important;
          }
          ol ol {
            list-style-type: lower-roman !important;
          }
          ol ol ol {
            list-style-type: lower-latin !important;
          }
          ol ol ol ol {
            list-style-type: decimal !important;
          }
          @media screen and (max-width:480px) {
            .preheader .rightColumnContent,
            .footer .rightColumnContent {
              text-align: left !important;
            }
            .preheader .rightColumnContent div,
            .preheader .rightColumnContent span,
            .footer .rightColumnContent div,
            .footer .rightColumnContent span {
              text-align: left !important;
            }
            .preheader .rightColumnContent,
            .preheader .leftColumnContent {
              font-size: 80% !important;
              padding: 5px 0;
            }
            table.wrapper-mobile {
              width: 100% !important;
              table-layout: fixed;
            }
            img.max-width {
              height: auto !important;
              max-width: 100% !important;
            }
            a.bulletproof-button {
              display: block !important;
              width: auto !important;
              font-size: 80%;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .columns {
              width: 100% !important;
            }
            .column {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            .social-icon-column {
              display: inline-block !important;
            }
          }
        </style>
            <!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Viga&display=swap" rel="stylesheet"><style>
          body {font-family: 'Viga', sans-serif;}
      </style><!--End Head user entered-->
          </head>
          <body>
            <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#f0f0f0;">
              <div class="webkit">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f0f0f0">
                  <tr>
                    <td valign="top" bgcolor="#f0f0f0" width="100%">
                      <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td>
                                  <!--[if mso]>
          <center>
          <table><tr><td width="600">
        <![endif]-->
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                            <tr>
                                              <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#ffffff" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
          <tr>
            <td role="module-content">
              <p></p>
            </td>
          </tr>
        
          <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 40px 30px;" bgcolor="#77dedb" data-distribution="1">
          <tbody>
            <tr role="module-content">
              <td height="100%" valign="top"><table width="550" style="width:550px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
            <tbody>
              <tr>
                <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b422590c-5d79-4675-8370-a10c2c76af02">
          <tbody>
            <tr>
            <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="left">
            <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="180" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/a982583c-c885-43f7-88a1-049b41268788/718x203.png" height="51">
          </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="1995753e-0c64-4075-b4ad-321980b82dfe" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:100px 0px 18px 0px; line-height:36px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #ffffff; font-size: 40px; font-family: inherit">Thank you for your order!</span></div><div></div></div></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2ffbd984-f644-4c25-9a1e-ef76ac62a549" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:18px 20px 20px 0px; line-height:24px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 24px">Now you can relax. We're workin on</span></div>
      <div style="font-family: inherit; text-align: inherit"><span style="font-size: 24px">getting your product to you ASAP!</span></div><div></div></div></td>
            </tr>
          </tbody>
        </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="69fc33ea-7c02-45ed-917a-b3b8a6866e89">
            <tbody>
              <tr>
                <td align="left" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;">
                  <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                    <tbody>
                      <tr>
                      <td align="center" bgcolor="#000000" class="inner-td" style="border-radius:6px; font-size:16px; text-align:left; background-color:inherit;">
                      
                      <a href="https://margamfarm-api.onrender.com/login" style="background-color:#000000; border:1px solid #000000; border-color:#000000; border-radius:0px; border-width:1px; color:#ffffff; display:inline-block; font-size:18px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Follow Your Delivery</a>
                      </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table></td>
              </tr>
            </tbody>
          </table></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="8b5181ed-0827-471c-972b-74c77e326e3d" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:30px 20px 18px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff; font-size: 24px">Order Summary</span></div><div></div></div></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f7373f10-9ba4-4ca7-9a2e-1a2ba700deb9">
          <tbody>
            <tr>
              <td style="padding:0px 30px 0px 30px;" role="module-content" height="100%" valign="top" bgcolor="">
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">
                  <tbody>
                    <tr>
                      <td style="padding:0px 0px 3px 0px;" bgcolor="#e7e7e7"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="264ee24b-c2b0-457c-a9c1-d465879f9935" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:18px 20px 18px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit">Order ID: ${orderId}</div>
      <div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff"><strong>Name: ${userName}</strong></span></div>
      <div style="font-family: inherit; text-align: inherit"><br></div>
      <div style="font-family: inherit; text-align: inherit; color: #000000;">${address}</div>
      <div style="font-family: inherit; text-align: inherit;color: #000000;">
      Location Link: <a href="${Location}" target="_blank" style="text-decoration: underline; color: #0645AD;"><span style="color: #0645AD;">${Location}</span></a>
    </div>
    
      <div style="font-family: inherit; text-align: inherit; color: #000000;">${city}, ${postal}</div>
      
      
            </tr>
          </tbody>
        </table>
        
        <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:20px 20px 0px 30px;" bgcolor="#FFFFFF" data-distribution="1,1,1,1">
  <tbody>
  ${orderItems.map((item, index) => `
  <tr role="module-content">
    <td height="100%" valign="top">
      <table width="100%" style="border-spacing:0; border-collapse:collapse; margin:0px 0px 20px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-${index}">
        <tbody>
          <tr>
            <td style="padding:0px;margin:0px;border-spacing:0;">
              <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="30%" style="table-layout: fixed;" data-muid="239f10b7-5807-4e0b-8f01-f2b8d25ec9d7.${index}">
                <tbody>
                  <tr>
                  <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="left">
                  <!-- Replace with dynamic image URL -->
                  <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; border-radius: 5px;" width="104" alt="${item.name}" data-proportionally-constrained="true" data-responsive="false" src="${getImageUrl(item.image)}" height="104">
                </td>
                
                  </tr>
                </tbody>
              </table>
            </td>
            <td style="padding:0px;margin:0px;border-spacing:0;">
              <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="70%" style="table-layout: fixed;" data-muid="f404b7dc-487b-443c-bd6f-131ccde745e2.${index}">
                <tbody>
                  <tr>
                    <td style="padding:18px 0px 18px 10px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
                      <div>
                        <div style="font-family: inherit; text-align: inherit; color: #000000;"><strong>${item.name}</strong></div>
                        <div style="font-family: inherit; text-align: inherit">${item.qty} x ₹${item.price}</div>
                        <div style="font-family: inherit; text-align: inherit"><br></div>
                        <div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff">₹${item.qty * item.price}</span></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
`).join('')}


      
        
        <table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f7373f10-9ba4-4ca7-9a2e-1a2ba700deb9.1">
          <tbody>
            <tr>
              <td style="padding:20px 30px 0px 30px;" role="module-content" height="100%" valign="top" bgcolor="#FFFFFF">
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">
                  <tbody>
                    <tr>
                      <td style="padding:0px 0px 3px 0px;" bgcolor="#E7E7E7"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="264ee24b-c2b0-457c-a9c1-d465879f9935.1" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:18px 20px 30px 30px; line-height:22px; text-align:inherit; background-color:#FFFFFF;" height="100%" valign="top" bgcolor="#FFFFFF" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><strong>Items Price: </strong> ₹${itemsprice}</div>
      <div style="font-family: inherit; text-align: inherit; color: #000000;"><strong>Shipping Charges:</strong> ₹${shippingprice}</div>
      <div style="font-family: inherit; text-align: inherit"; color: #000000;><strong>Payment Method:</strong> ${paymentmethod}</div>
      <div style="font-family: inherit; text-align: inherit; color: #000000;"><br>
      <strong>Grand Total</strong></div>
      <div style="font-family: inherit; text-align: inherit"><br></div>
      <div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff; font-size: 32px; font-family: inherit">₹${totalPrice}</span></div><div></div></div></td>
            </tr>
          </tbody>
        </table>
        
        <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding: 0px 20px 0px 20px;" bgcolor="#0055ff" data-distribution="1,1,1,1">
  <tbody>
    <tr role="module-content">
      <td height="100%" valign="top">
      <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="" class="column column-0" align="center" style="max-width: 400px; margin: 0 auto;">
      <tbody>
        <tr>
          <td align="center" style="padding: 0;">
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #0055ff; border-radius: 15px;">
              <tbody>
                <tr>
                  <td style="padding: 20px 0; text-align: center;" role="module-content">
                    <div>
                      <div style="font-family: inherit; font-size: 20px; color: #ffffff;">Contact Us</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 20px; text-align: center;" role="module-content">
                    <p style="font-size: 18px; color: #ffffff; margin-bottom: 10px;">Suresh Babu - 8884345668</p>
                    <p style="font-size: 16px; color: #ffffff; margin-bottom: 10px;">Margam Farms</p>
                    <p style="font-size: 16px; color: #ffffff; margin-bottom: 10px;">Melmattai Vinamangalam, TamilNadu, 604503</p>
                    <div style="display: inline-block; background-color: #ffffff; padding: 10px 20px; border-radius: 30px; text-align: center;">
                    <p style="font-size: 16px; color: #0055ff; margin-bottom: 10px; font-weight: bold;">margamfarm@gmail.com</p>
                  </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    
      </td>
    </tr>
  </tbody>
</table>

                                            </tr>
                                          </table>
                                          <!--[if mso]>
                                        </td>
                                      </tr>
                                    </table>
                                  </center>
                                  <![endif]-->
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </center>
          </body>
        </html>`,
    }

  sgMail
    .send(emailContent)
    .then(() => {
      console.log('Email for order confirmation sent')
    })
    .catch((error) => {
      console.error(error)
    })
});

router.post('/send-order-delivered/orderId', protect, async (req, res) => {
  //const { orderId } = req.params;
  const { orderId, userEmail,userName } = req.body; // Data sent from the frontend

  // Customize your email template here
  const emailContent = {
    to: userEmail,
    from: 'margamfarm@gmail.com', // Replace with your email
    subject: 'Order Delivered',
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
          <!--[if !mso]><!-->
          <meta http-equiv="X-UA-Compatible" content="IE=Edge">
          <!--<![endif]-->
          <!--[if (gte mso 9)|(IE)]>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          <!--[if (gte mso 9)|(IE)]>
      <style type="text/css">
        body {width: 620px;margin: 0 auto;}
        table {border-collapse: collapse;}
        table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
        img {-ms-interpolation-mode: bicubic;}
      </style>
    <![endif]-->
          <style type="text/css">
        body, p, div {
          font-family: arial,helvetica,sans-serif;
          font-size: 14px;
        }
        body {
          color: #000000;
        }
        body a {
          color: #932A89;
          text-decoration: none;
        }
        p { margin: 0; padding: 0; }
        table.wrapper {
          width:100% !important;
          table-layout: fixed;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        img.max-width {
          max-width: 100% !important;
        }
        .column.of-2 {
          width: 50%;
        }
        .column.of-3 {
          width: 33.333%;
        }
        .column.of-4 {
          width: 25%;
        }
        ul ul ul ul  {
          list-style-type: disc !important;
        }
        ol ol {
          list-style-type: lower-roman !important;
        }
        ol ol ol {
          list-style-type: lower-latin !important;
        }
        ol ol ol ol {
          list-style-type: decimal !important;
        }
        @media screen and (max-width:480px) {
          .preheader .rightColumnContent,
          .footer .rightColumnContent {
            text-align: left !important;
          }
          .preheader .rightColumnContent div,
          .preheader .rightColumnContent span,
          .footer .rightColumnContent div,
          .footer .rightColumnContent span {
            text-align: left !important;
          }
          .preheader .rightColumnContent,
          .preheader .leftColumnContent {
            font-size: 80% !important;
            padding: 5px 0;
          }
          table.wrapper-mobile {
            width: 100% !important;
            table-layout: fixed;
          }
          img.max-width {
            height: auto !important;
            max-width: 100% !important;
          }
          a.bulletproof-button {
            display: block !important;
            width: auto !important;
            font-size: 80%;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .columns {
            width: 100% !important;
          }
          .column {
            display: block !important;
            width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .social-icon-column {
            display: inline-block !important;
          }
        }
      </style>
          <!--user entered Head Start--><!--End Head user entered-->
        </head>
        <body>
          <center class="wrapper" data-link-color="#932A89" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#f0f0f0;">
            <div class="webkit">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f0f0f0">
                <tr>
                  <td valign="top" bgcolor="#f0f0f0" width="100%">
                    <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="100%">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td>
                                <!--[if mso]>
        <center>
        <table><tr><td width="620">
      <![endif]-->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:620px;" align="center">
                                          <tr>
                                            <td role="modules-container" style="padding:0px 10px 0px 10px; color:#000000; text-align:left;" bgcolor="#F0F0F0" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
        <tr>
          <td role="module-content">
            <p></p>
          </td>
        </tr>
    <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 0px 10px 0px;" bgcolor="#F0F0F0" data-distribution="1,1">
        <tbody>
          <tr role="module-content">
            <td height="100%" valign="top"><table width="300" style="width:300px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
          <tbody>
            <tr>
              <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b61e00de-19e5-4f73-9ecc-b8ea4f872e5c">
        <tbody>
          <tr>
    <td style="padding:0px;margin:0px;border-spacing:0; text-align: center;">
              <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:80% !important; width:80%; height:auto !important;" width="240" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/a982583c-c885-43f7-88a1-049b41268788/718x203.png">
            </td>
          </tr>
        </tbody>
      </table></td>
            </tr>
          </tbody>
        </table>
        <table width="300" style="width:300px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-1">
          <tbody>
            <tr>
              <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="1444ebb1-667b-4c9d-a9a5-5bf0e36fcce8">
        <tbody>
          <tr>
            <td style="padding:0px 0px 4px 0px;" role="module-content" bgcolor="">
            </td>
          </tr>
        </tbody>
      </table>
      </td>
            </tr>
          </tbody>
        </table></td>
          </tr>
        </tbody>
      </table>
    <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:50px 20px 50px 20px;" bgcolor="#3172a3" data-distribution="1">
        <tbody>
          <tr role="module-content">
            <td height="100%" valign="top"><table width="460" style="width:460px; border-spacing:0; border-collapse:collapse; margin:0px 50px 0px 50px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
          <tbody>
            <tr>
              <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="efe5a2c4-1b11-49e7-889d-856d80b40f63" data-mc-module-version="2019-10-22">
        <tbody>
          <tr>
            <td style="padding:40px 0px 30px 0px; line-height:36px; text-align:inherit; background-color:#74bcd9;" height="100%" valign="top" bgcolor="#74bcd9" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 46px; color: #ffffff; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif"><strong>Order Delivered</strong></span></div><div></div></div></td>
          </tr>
        </tbody>
      </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="efe5a2c4-1b11-49e7-889d-856d80b40f63.2" data-mc-module-version="2019-10-22">
        <tbody>
          <tr>
            <td style="padding:50px 30px 30px 30px; line-height:28px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 20px; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; color: #656565">Hi ${userName},</span></div>
    <div style="font-family: inherit; text-align: inherit"><br></div>
    <div style="font-family: inherit; text-align: inherit"><span style="font-size: 20px; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; color: #656565">Confirmation of </span><span style="font-size: 20px; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; color: #932a89"><strong>order ${orderId} has been delivered to you</strong></span><span style="font-size: 20px; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; color: #656565">Kindly ensure your payment has been completed; feel free to disregard if already settled. Click the link below to provide your valuable ratings and comments for the products you purchased . </span></div><div></div></div></td>
          </tr>
        </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="d0bf6998-834d-4cc3-b775-8e43e7fcbf90">
          <tbody>
            <tr>
              <td align="left" bgcolor="#FFFFFF" class="outer-td" style="padding:0px 0px 0px 30px; background-color:#FFFFFF;">
                <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                  <tbody>
                    <tr>
                    <td align="center" bgcolor="#932A89" class="inner-td" style="border-radius:6px; font-size:16px; text-align:left; background-color:inherit;">
                      <a href='https://margamfarm-api.onrender.com/login' style="background-color:#932A89; border:0px solid #333333; border-color:#333333; border-radius:0px; border-width:0px; color:#ffffff; display:inline-block; font-size:16px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:15px 25px 15px 25px; text-align:center; text-decoration:none; border-style:solid; font-family:trebuchet ms,helvetica,sans-serif;" target="_blank">Review</a>
                    </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="efe5a2c4-1b11-49e7-889d-856d80b40f63.1" data-mc-module-version="2019-10-22">
        <tbody>
          <tr>
            <td style="padding:40px 100px 50px 30px; line-height:26px; text-align:inherit; background-color:#FFFFFF;" height="100%" valign="top" bgcolor="#FFFFFF" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 16px; color: #656565">Thanks!</span></div>
            <div style="font-family: inherit; text-align: inherit"><span style="font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 16px; color: #656565">Suresh Babu</span></div>
            <div style="font-family: inherit; text-align: inherit"><span style="font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 16px; color: #656565">Margam Farms</span></div>
        
        <div></div></div></td>
          </tr>
        </tbody>
      </table></td>
            </tr>
          </tbody>
        </table></td>
          </tr>
        </tbody>
      </table>
    
      <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:40px 0px 1px 0px;" bgcolor="#F0F0F0" data-distribution="1">
        <tbody>
          <tr role="module-content">
            <td height="100%" valign="top"><table width="580" style="width:580px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
          <tbody>
            <tr>
              <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="social" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="da66730a-c885-4e7b-bda0-4df5c4f2ce23">
        <tbody>
          <tr>
            <td valign="top" style="padding:0px 0px 0px 0px; font-size:6px; line-height:10px;" align="center">
              <table align="center" style="-webkit-margin-start:auto;-webkit-margin-end:auto;">
                <tbody><tr align="center"><td style="padding: 0px 5px;" class="social-icon-column">
    
        </td>
        
        <td style="padding: 0px 5px;" class="social-icon-column">
          <a role="social-icon-link" href="https://twitter.com/MargamFarm" target="_blank" alt="Twitter" title="Twitter" style="display:inline-block; background-color:#9D9D9D; height:21px; width:21px;">
            <img role="social-icon" alt="Twitter" title="Twitter" src="https://mc.sendgrid.com/assets/social/white/twitter.png" style="height:21px; width:21px;" height="21" width="21">
          </a>
        </td>
        <td style="padding: 0px 5px;" class="social-icon-column">
          <a role="social-icon-link" href="https://www.linkedin.com/in/sjayanthkumar/" target="_blank" alt="LinkedIn" title="LinkedIn" style="display:inline-block; background-color:#9D9D9D; height:21px; width:21px;">
            <img role="social-icon" alt="LinkedIn" title="LinkedIn" src="https://mc.sendgrid.com/assets/social/white/linkedin.png" style="height:21px; width:21px;" height="21" width="21">
          </a>
        </td>
        </tr>
        </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
                                          </tr>
                                        </table>
                                        <!--[if mso]>
                                      </td>
                                    </tr>
                                  </table>
                                </center>
                                <![endif]-->
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </center>
        </body>
      </html>`,
  }

sgMail
  .send(emailContent)
  .then(() => {
    console.log('Email for order delivered sent')
  })
  .catch((error) => {
    console.error(error)
  })
});

router.post('/send-order-received/orderId', protect, async (req, res) => {
  //const { orderId } = req.params;
  const { orderId, userEmail,usermobile, userName,address,city,Location,postal, orderItems,itemsprice,shippingprice, totalPrice, paymentmethod } = req.body; // Data sent from the frontend
  //console.log("User email id is",userEmail);
  //const itemImageUrls = orderItems.map(item => item.image);
  //console.log("Image URL - ", itemImageUrls);
  // Create the order items list from the JSON string
  //const parsedOrderItems = JSON.parse(orderItems);
  //const itemImageUrls = orderItems.map(item => item.image);
  function getImageUrl(itemImage) {
    switch (itemImage) {
      case '/images/mango.jpg':
        return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/37c65a67-738e-4e97-9bb2-82699ea41cbe/1536x2048.jpg';
      case '/images/coco.jpg':
        return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/04470062-0230-48a4-bc79-b024ab762f30/1144x1536.jpg';
      case '/images/ground.jpg':
        return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/710d7fa3-ac9c-4e43-b4df-48e17d70807c/3472x4640.jpg';
      case '/images/grnd.jpg':
        return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/ab28d78f-65c8-450c-ba2e-b4828153a583/1536x2048.jpg';
      case '/images/sesame.jpg':
        return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/e585d90d-fd16-46df-ab36-c35ec9b59689/1200x1599.jpg';
      case '/uploads\\image-1693204057779.jpg':
        return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/7bdfe2f6-4bfb-44e1-9aa6-f14f8b74e4d7/1536x2048.jpg';
      case '/uploads\\image-1693214629899.jpg':
        return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/cd969df7-2f0a-49d6-80f7-efdf2b3c643b/1536x2048.jpg';
      default:
        return 'http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/73ee1c46-f0ae-4829-a5a8-ec4a5cd8a2bb/512x512.png';
    }
  }

  

  // Customize your email template here
  const emailContent = {
    to: ['margamfarm@gmail.com','vidyamohanam@hotmail.com','sureshvbabu@hotmail.com'],
    from: 'margamfarm@gmail.com', // Replace with your email
    subject: 'Order Received',
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
          <!--[if !mso]><!-->
          <meta http-equiv="X-UA-Compatible" content="IE=Edge">
          <!--<![endif]-->
          <!--[if (gte mso 9)|(IE)]>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          <!--[if (gte mso 9)|(IE)]>
      <style type="text/css">
        body {width: 600px;margin: 0 auto;}
        table {border-collapse: collapse;}
        table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
        img {-ms-interpolation-mode: bicubic;}
      </style>
    <![endif]-->
          <style type="text/css">
        body, p, div {
          font-family: inherit;
          font-size: 14px;
        }
        body {
          color: #000000;
        }
        body a {
          color: #1188E6;
          text-decoration: none;
        }
        p { margin: 0; padding: 0; }
        table.wrapper {
          width:100% !important;
          table-layout: fixed;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        img.max-width {
          max-width: 100% !important;
        }
        .column.of-2 {
          width: 50%;
        }
        .column.of-3 {
          width: 33.333%;
        }
        .column.of-4 {
          width: 25%;
        }
        ul ul ul ul  {
          list-style-type: disc !important;
        }
        ol ol {
          list-style-type: lower-roman !important;
        }
        ol ol ol {
          list-style-type: lower-latin !important;
        }
        ol ol ol ol {
          list-style-type: decimal !important;
        }
        @media screen and (max-width:480px) {
          .preheader .rightColumnContent,
          .footer .rightColumnContent {
            text-align: left !important;
          }
          .preheader .rightColumnContent div,
          .preheader .rightColumnContent span,
          .footer .rightColumnContent div,
          .footer .rightColumnContent span {
            text-align: left !important;
          }
          .preheader .rightColumnContent,
          .preheader .leftColumnContent {
            font-size: 80% !important;
            padding: 5px 0;
          }
          table.wrapper-mobile {
            width: 100% !important;
            table-layout: fixed;
          }
          img.max-width {
            height: auto !important;
            max-width: 100% !important;
          }
          a.bulletproof-button {
            display: block !important;
            width: auto !important;
            font-size: 80%;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .columns {
            width: 100% !important;
          }
          .column {
            display: block !important;
            width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .social-icon-column {
            display: inline-block !important;
          }
        }
      </style>
          <!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Viga&display=swap" rel="stylesheet"><style>
        body {font-family: 'Viga', sans-serif;}
    </style><!--End Head user entered-->
        </head>
        <body>
          <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#f0f0f0;">
            <div class="webkit">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f0f0f0">
                <tr>
                  <td valign="top" bgcolor="#f0f0f0" width="100%">
                    <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="100%">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td>
                                <!--[if mso]>
        <center>
        <table><tr><td width="600">
      <![endif]-->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                          <tr>
                                            <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#ffffff" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
        <tr>
          <td role="module-content">
            <p></p>
          </td>
        </tr>
      
        <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 40px 30px;" bgcolor="#77dedb" data-distribution="1">
        <tbody>
          <tr role="module-content">
            <td height="100%" valign="top"><table width="550" style="width:550px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
          <tbody>
            <tr>
              <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b422590c-5d79-4675-8370-a10c2c76af02">
        <tbody>
          <tr>
          <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="left">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="180" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/b14359546725f46d/a982583c-c885-43f7-88a1-049b41268788/718x203.png" height="51">
        </td>
          </tr>
        </tbody>
      </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="1995753e-0c64-4075-b4ad-321980b82dfe" data-mc-module-version="2019-10-22">
        <tbody>
          <tr>
            <td style="padding:100px 0px 18px 0px; line-height:36px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #ffffff; font-size: 40px; font-family: inherit">Dear Admin, Order Received!</span></div><div></div></div></td>
          </tr>
        </tbody>
      </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2ffbd984-f644-4c25-9a1e-ef76ac62a549" data-mc-module-version="2019-10-22">
        <tbody>
          <tr>
            <td style="padding:18px 20px 20px 0px; line-height:24px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 24px">Lets get going to deliver the</span></div>
    <div style="font-family: inherit; text-align: inherit"><span style="font-size: 24px">order ASAP!</span></div><div></div></div></td>
          </tr>
        </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="69fc33ea-7c02-45ed-917a-b3b8a6866e89">
          <tbody>
            <tr>
              <td align="left" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;">
                <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                  <tbody>
                    <tr>
                    <td align="center" bgcolor="#000000" class="inner-td" style="border-radius:6px; font-size:16px; text-align:left; background-color:inherit;">
                    
                    <a href="https://margamfarm-api.onrender.com/login" style="background-color:#000000; border:1px solid #000000; border-color:#000000; border-radius:0px; border-width:1px; color:#ffffff; display:inline-block; font-size:18px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Order Details</a>
                    </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table></td>
            </tr>
          </tbody>
        </table></td>
          </tr>
        </tbody>
      </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="8b5181ed-0827-471c-972b-74c77e326e3d" data-mc-module-version="2019-10-22">
        <tbody>
          <tr>
            <td style="padding:30px 20px 18px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff; font-size: 24px">Order Summary</span></div><div></div></div></td>
          </tr>
        </tbody>
      </table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f7373f10-9ba4-4ca7-9a2e-1a2ba700deb9">
        <tbody>
          <tr>
            <td style="padding:0px 30px 0px 30px;" role="module-content" height="100%" valign="top" bgcolor="">
              <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">
                <tbody>
                  <tr>
                    <td style="padding:0px 0px 3px 0px;" bgcolor="#e7e7e7"></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="264ee24b-c2b0-457c-a9c1-d465879f9935" data-mc-module-version="2019-10-22">
        <tbody>
          <tr>
            <td style="padding:18px 20px 18px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit">Order ID: ${orderId}</div>
    <div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff"><strong>Customer Name: ${userName}</strong></span></div>
        <div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff"><strong>Mobile No: ${usermobile}</strong></span></div>
            <div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff"><strong>Email ID: ${userEmail}</strong></span></div>
    <div style="font-family: inherit; text-align: inherit"><br></div>
    <div style="font-family: inherit; text-align: inherit; color: #000000;">${address}</div>
    <div style="font-family: inherit; text-align: inherit;color: #000000;">
    Location Link: <a href="${Location}" target="_blank" style="text-decoration: underline; color: #0645AD;"><span style="color: #0645AD;">${Location}</span></a>
  </div>
  
    <div style="font-family: inherit; text-align: inherit; color: #000000;">${city}, ${postal}</div>
    
    
          </tr>
        </tbody>
      </table>
      
      <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:20px 20px 0px 30px;" bgcolor="#FFFFFF" data-distribution="1,1,1,1">
<tbody>
${orderItems.map((item, index) => `
<tr role="module-content">
  <td height="100%" valign="top">
    <table width="100%" style="border-spacing:0; border-collapse:collapse; margin:0px 0px 20px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-${index}">
      <tbody>
        <tr>
          <td style="padding:0px;margin:0px;border-spacing:0;">
            <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="30%" style="table-layout: fixed;" data-muid="239f10b7-5807-4e0b-8f01-f2b8d25ec9d7.${index}">
              <tbody>
                <tr>
                <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="left">
                <!-- Replace with dynamic image URL -->
                <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; border-radius: 5px;" width="104" alt="${item.name}" data-proportionally-constrained="true" data-responsive="false" src="${getImageUrl(item.image)}" height="104">
              </td>
              
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding:0px;margin:0px;border-spacing:0;">
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="70%" style="table-layout: fixed;" data-muid="f404b7dc-487b-443c-bd6f-131ccde745e2.${index}">
              <tbody>
                <tr>
                  <td style="padding:18px 0px 18px 10px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
                    <div>
                      <div style="font-family: inherit; text-align: inherit; color: #000000;"><strong>${item.name}</strong></div>
                      <div style="font-family: inherit; text-align: inherit">${item.qty} x ₹${item.price}</div>
                      <div style="font-family: inherit; text-align: inherit"><br></div>
                      <div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff">₹${item.qty * item.price}</span></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>
`).join('')}


    
      
      <table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f7373f10-9ba4-4ca7-9a2e-1a2ba700deb9.1">
        <tbody>
          <tr>
            <td style="padding:20px 30px 0px 30px;" role="module-content" height="100%" valign="top" bgcolor="#FFFFFF">
              <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">
                <tbody>
                  <tr>
                    <td style="padding:0px 0px 3px 0px;" bgcolor="#E7E7E7"></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="264ee24b-c2b0-457c-a9c1-d465879f9935.1" data-mc-module-version="2019-10-22">
        <tbody>
          <tr>
            <td style="padding:18px 20px 30px 30px; line-height:22px; text-align:inherit; background-color:#FFFFFF;" height="100%" valign="top" bgcolor="#FFFFFF" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><strong>Items Price: </strong> ₹${itemsprice}</div>
    <div style="font-family: inherit; text-align: inherit; color: #000000;"><strong>Shipping Charges:</strong> ₹${shippingprice}</div>
    <div style="font-family: inherit; text-align: inherit"; color: #000000;><strong>Payment Method:</strong> ${paymentmethod}</div>
    <div style="font-family: inherit; text-align: inherit; color: #000000;"><br>
    <strong>Grand Total</strong></div>
    <div style="font-family: inherit; text-align: inherit"><br></div>
    <div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff; font-size: 32px; font-family: inherit">₹${totalPrice}</span></div><div></div></div></td>
          </tr>
        </tbody>
      </table>
      
      

                                          </tr>
                                        </table>
                                        <!--[if mso]>
                                      </td>
                                    </tr>
                                  </table>
                                </center>
                                <![endif]-->
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </center>
        </body>
      </html>`,
  }

sgMail
  .send(emailContent)
  .then(() => {
    console.log('Email for order received sent')
  })
  .catch((error) => {
    console.error(error)
  })
});


router.post('/send-sms/orderId', async (req, res) => {
  try {
    const { orderId, userName } = req.body;
    // Hardcoded phone numbers
    const toPhoneNumbers = ['+919499905475', '+918884345668', '+919901832861']; // Indian phone number format
    const message = `An Order with Order ID ${orderId} has been received from ${userName}. For more details, Check your mail.`;

    // Send the SMS to each phone number in the array
    const smsPromises = toPhoneNumbers.map(async (toPhoneNumber) => {
      try {
        const sms = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: toPhoneNumber,
        });

        console.log(`SMS sent to ${toPhoneNumber} with SID: ${sms.sid}`);
      } catch (error) {
        console.error(`Failed to send SMS to ${toPhoneNumber}:`, error);
      }
    });

    // Wait for all SMS messages to be sent
    await Promise.all(smsPromises);

    res.json({ message: 'SMS sent successfully to all recipients' });
  } catch (error) {
    console.error('Failed to send SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

export default router;