<h1 align="center">Margam Farms</h1>
<br>

<p style="text-align: justify;">
A dynamic website for displaying the available organic products at <b>Margam Farms</b>, a admin dashboard that displays the sales and customer data of <b>Margam Farms</b>. Also provides multiple API's for other similar businesses to interact with <b>Margam Farms</b>. 
<br>
<b>Margam Farms</b> is developed using a MERN stack, which includes MongoDB, Express.js, React.js, and Node.js. This stack delivers an exceptional user experience, robust backend functionality, and efficient data storage and retrieval capabilities.

## Made with

| Tech used               | For        |
| ----------------------- | ---------- |
| HTML + CSS + JavaScript | Frontend   |
| Node + Express          | Backend    |
| MongoDB                 | Database   |
| Render                  | Hosting    |


## Admin Dashboard

![Admin Dashboard](https://github.com/SJ-Kumar/MargamFarms/blob/21488ae238731ca863bd0e1f50a0340b115b3df2/frontend/src/assets/admin1.png)

![Admin Dashboard](https://github.com/SJ-Kumar/MargamFarms/blob/21488ae238731ca863bd0e1f50a0340b115b3df2/frontend/src/assets/admin2.png)

## Admin Panel
- The admin panel view is meant to handle all the orders, products, and registered users
- An order can be marked as delivered, after the user has completed the payment
- The admin can create a product for the shop, which makes it easier to add/remove more products to replicate a real world e-commerce site
- The users detail can altered, only by setting them as admin or not. Other than this, the admin cannot change any other detail about the registered user.
- Helps give an estimate of the total number of orders and users on the app.


## Home Page

![Home Page](https://github.com/SJ-Kumar/MargamFarms/blob/21488ae238731ca863bd0e1f50a0340b115b3df2/frontend/src/assets/header%20with%20pc.png)

## Latest Products

![Latest Products](https://github.com/SJ-Kumar/MargamFarms/blob/4caa7fc3063962d3e65c0ad4930be236a283e30e/frontend/src/assets/products.png)


## Sign In

![Sign In](https://github.com/SJ-Kumar/MargamFarms/blob/4caa7fc3063962d3e65c0ad4930be236a283e30e/frontend/src/assets/signin.png)

## Side Cart Pop up

![Side Cart Page](https://github.com/SJ-Kumar/MargamFarms/blob/4caa7fc3063962d3e65c0ad4930be236a283e30e/frontend/src/assets/sidecart.png)

## Shopping Cart

![Shopping Cart](https://github.com/SJ-Kumar/MargamFarms/blob/4caa7fc3063962d3e65c0ad4930be236a283e30e/frontend/src/assets/shopping.png)



## Setup process

Run the below command in the root directory to install all required packages for the backend server:

```
npm install
```

Create a **.env** file in the root directory with content like below:

```
PORT = 5000
CLIENT_URL=http://localhost:3000
MONGO_URI = <MongoDB url>
JWT_SECRET = <JWT Secret Key>
PAGINATION_LIMIT=4
REACT_APP_YOUTUBE_ID=<Video ID from Youtube>
REACT_APP_YOUTUBE_API_KEY=<Youtube Account API Key>

```

## Running process

Run the below command in the root directory:

```
npm run dev

```

## Technology Stack

The MERN Stack is a popular full-stack development solution that combines MongoDB, Express.js, React.js, and Node.js. These components seamlessly work together to create robust web applications.

## MERN Stack Components:

*MongoDB:* A flexible NoSQL database for storing data in JSON-like documents. It excels in performance, availability, and scalability, making it ideal for handling large volumes of data and complex queries.

*Express.js:* A minimalistic and flexible web application framework for Node.js. It simplifies building web APIs and handling HTTP requests, providing robust features and middleware for web and mobile applications.

*React.js:* A JavaScript library for building user interfaces, especially Single Page Applications (SPAs). Its component-based architecture enables code reusability and maintainability.

*Node.js:* A JavaScript runtime based on Chrome's V8 engine, enabling server-side JavaScript execution. It focuses on performance, making it perfect for scalable and efficient back-end development.




