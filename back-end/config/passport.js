
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Customer = require('../models/CustomerModel');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;

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