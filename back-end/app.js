
require('dotenv').config();
const  connectDB  = require('./config/database');
const passportSetup = require('./config/passport');
const express = require('express');
const app = express();
const customerRoutes = require('./routes/CustomerRoutes');
const passport = require('passport'); // Assurez-vous d'importer Passport.js
const session = require('express-session');
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


app.use('/v1/customer' ,customerRoutes );
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

  
const port = process.env.PORT ;
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
    });
