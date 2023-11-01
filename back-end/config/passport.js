const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/UserModel');
const Customer = require('../models/CustomerModel');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;


passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'email', // Assuming email is the field to identify the user
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
  
          if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
          }
  
          const isValidPassword = await bcrypt.compare(password, user.password);
  
          if (!isValidPassword) {
            return done(null, false, { message: 'Invalid email or password' });
          }
  
          if (!user.active) {
            return done(null, false, { message: 'User is not active' });
          }
  
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  
  
  
  
  // Serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialization
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });

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
 

  
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY, // Replace with your secret key
  };
  
  passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.sub); // Replace with your User model method
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
  
  module.exports = passport;