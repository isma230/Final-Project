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
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51OFNKLJC7MJL46iMvDY4Sgivb4bLlpBPCj3FbBBudCvKR6RZYpTn7peSpOr6actP0Xyfb1uMchqSDFsYAkN9qSs300Rpzv0IRL');
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
app.use(cors({
  origin: 'http://localhost:5173', // your frontend's address
  credentials: true, 
}));

app.use('/v1/users',userRoutes);
app.use('/v1/customers' ,customerRoutes );
app.use('/v1/categories', categoryRoutes);
app.use('/v1/subcategories', subcategoryRoutes);
app.use('/v1/products', productRoutes);
app.use('/v1/orders',orderRoutes );

app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, payment_method } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents
      currency,
      payment_method, 
      confirmation_method: 'manual',
      confirm: true,
      return_url: 'http://localhost:5173/success', // replace with your actual return URL
    });
    

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/stripe-transactions', async (req, res) => {
  try {
    const transactions = await stripe.paymentIntents.list({
      limit: 10, // Adjust the limit as needed
    });

    res.json(transactions.data);
  } catch (error) {
    console.error('Error fetching Stripe transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
    }); 