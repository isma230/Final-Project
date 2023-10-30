
require('dotenv').config();
const  connectDB  = require('./config/database');
const express = require('express');
const app = express();
const customerRoutes = require('./routes/CustomerRoutes');
const bodyParser = require('body-parser');
const passport = require('passport'); // Assurez-vous d'importer Passport.js
const session = require('express-session');
const Customer = require('./models/CustomerModel');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRET_KEY;

app.use(express.json());

app.use(session({ 
    secret: secretKey, // Utilisez votre clé secrète
    resave: false,
    saveUninitialized: false
  }));
  
  // Initialisation de Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('customer-local', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const customer = await Customer.findOne({ email });
        if (!customer) {
          return done(null, false, { message: 'L\'email ou le mot de passe est incorrect.' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
          return done(null, false, { message: 'L\'email ou le mot de passe est incorrect.' });
        }
  
        return done(null, customer);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((customer, done) => {
    done(null, customer.id);
  });
  
  passport.deserializeUser((id, done) => {
    Customer.findById(id)
      .then(customer => {
        done(null, customer);
      })
      .catch(err => {
        done(err, null);
      });
  });
  

app.use( customerRoutes );
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

  
const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
    });
