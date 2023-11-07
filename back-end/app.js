const express = require('express');
const session = require('express-session');
const passport = require('passport');
const userRoutes = require('./routes/UserRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const customerRoutes = require('./routes/CustomerRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const subcategoryRoutes = require('./routes/SubCategoryRoutes');
const productRoutes = require('./routes/ProductRoutes');
const cookieParser = require('cookie-parser');
//call the .env file
require('dotenv').config();

// Initialize Express 
const app = express();
const db = require('./config/database');
const passportSetup = require('./config/passport');

app.use(cookieParser());

// Use express-session to handle sessions
app.use(session({
  secret: process.env.SESSION_SECRET_KEY, // Change this to a strong, random secret
  resave: false,
  saveUninitialized: false,
  
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


app.use('/v1/users',userRoutes);
app.use('/v1/customers' ,customerRoutes );
app.use('/v1/categories', categoryRoutes);
app.use('/v1/subcategories', subcategoryRoutes);
app.use('/v1/products', productRoutes);
app.use('/v1/orders',orderRoutes );


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
    }); 