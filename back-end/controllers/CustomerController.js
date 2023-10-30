const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Customer = require('../models/CustomerModel');
const bcrypt = require('bcrypt');
require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');



const secretKey = process.env.SECRET_KEY;

 
//------

function isAuthorizedUser(req, allowedRoles) {
  if (!req.user) {
    return false;
  }

  return allowedRoles.includes(req.user.role);
}




function isCustomer(req) {
  return req.user && req.user.role === 'customer'; // Ajustez cette condition selon votre modèle de données.
}

const registerCustomer = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Vérifie si l'utilisateur a le rôle "customer"
    if (!isCustomer(req)) {
      return res.status(403).json({ message: 'Seuls les clients peuvent créer un compte.' });
    }

    // Vérifie si l'adresse e-mail est unique
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Cet email est déjà enregistré.' });
    }

    // Envoi de l'email de validation
    await sendValidationEmail(email, res); // Ajout de 'res' ici

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer un nouveau client
    const newCustomer = new Customer({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      valid_account: false, // Le compte n'est pas encore validé
    });

    await newCustomer.save();

    res.status(201).json({ message: 'Compte client créé avec succès. Vérifiez votre e-mail pour la validation.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la création du compte client.' });
  }
};


const sendValidationEmail = async (email, res) => {
  try {
    const token = jwt.sign({ email }, secretKey, {
      expiresIn: '1d', // Durée de validité du token (1 jour)
    });

    const transporter = nodemailer.createTransport({
      service: 'votre_service_email',
      auth: {
        user: 'votre_email',
        pass: 'votre_mot_de_passe',
      },
    });

    const activationLink = `https://votre-site.com/activation?token=${token}`;

    await transporter.sendMail({
      from: 'votre_email',
      to: email,
      subject: 'Confirmation de compte',
      html: `Cliquez sur le lien suivant pour valider votre compte : <a href="${activationLink}">${activationLink}</a>`,
    });

    res.status(200).json({ message: 'Email de validation envoyé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email de validation." });
  }
};
const validateEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Token de validation manquant.' });
    }

    // Vérifiez le token
    jwt.verify(token, 'votre_clé_secrète', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token de validation invalide.' });
      }

      const customerId = decoded.customerId;

      // Recherchez le client par son ID
      const customer = await Customer.findById(customerId);

      if (!customer) {
        return res.status(404).json({ message: 'Client non trouvé.' });
      }

      // Vérifiez si le compte du client est déjà validé
      if (customer.valid_account) {
        return res.status(400).json({ message: 'Le compte est déjà validé.' });
      }

      // Activer le compte du client
      customer.valid_account = true;

      // Sauvegarder les modifications dans la base de données
      await customer.save();

      res.status(200).json({ message: 'Compte activé avec succès.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur sest produite lors de l'activation du compte." });
  }
};
//----------------------------------------------------

const getCustomerProfile = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Accès non autorisé. Authentification requise.' });
  }

  res.status(200).json(req.user);
};

const updateCustomerProfile = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Accès non autorisé. Authentification requise.' });
  }

  const updatedData = req.body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.user._id, updatedData, { new: true });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour du profil du client.' });
  }
};

const deleteCustomerAccount = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Accès non autorisé. Authentification requise.' });
  }

  try {
     await Customer.findByIdAndRemove(req.user._id);
    res.status(200).json({ message: 'Compte client supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression du compte client.' });
  }
};

const loginCustomer = (req, res, next) => {
  passport.authenticate('customer-local', async (err, customer, info) => {
    if (err) {
      return next(err);
    }

    if (!customer) {
      return res.status(401).json(info);
    }

    // Vérifier si le compte du client est actif
    if (!customer.active) {
      return res.status(401).json({ message: 'Votre compte n\'est pas actif.' });
    }

    // Vérifier si le compte du client est valide (si nécessaire)
    if (!customer.valid_account) {
      return res.status(401).json({ message: 'Votre compte n\'est pas valide.' });
    }

    req.logIn(customer, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({ message: 'Authentification réussie.' });
    });
  })(req, res, next);
};



// Récupérer la liste de tous les clients
const getAllCustomers = async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les rôles d'administrateur ou de gestionnaire
    if (!req.user || (!req.user.isAdmin && !req.user.isManager)) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }

    // Définir la limite par page (dans cet exemple, 10 clients par page)
    const limit = 10;

    // Récupérer la page demandée depuis les paramètres de requête (par exemple, ?page=1)
    const page = parseInt(req.query.page) || 1;

    // Récupérer la liste de clients en fonction de la limite et de la page
    const customers = await Customer.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    // Si aucun client n'existe, renvoyer un tableau vide
    if (customers.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération de la liste des clients.' });
  }
};

const searchForCustomer = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied. Only admin and manager can access this feature.' });
    }

    const searchQuery = req.query.query || ''; // Paramètre de recherche, par défaut une chaîne vide
    const page = parseInt(req.query.page) || 1; // Paramètre de page, par défaut 1
    const maxResults = 10; // Nombre maximum de résultats par page
    const sort = req.query.sort || ''; // Paramètre de tri, par défaut une chaîne vide

    // Logique pour rechercher les clients en fonction de ces paramètres
    const customers = await Customer.find({
      $or: [
        { first_name: { $regex: searchQuery, $options: 'i' } },
        { last_name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
      ],
    })
      .limit(maxResults)
      .skip((page - 1) * maxResults) // Pour la pagination
      .sort(sort); // Tri

    res.status(200).json({
      query: searchQuery,
      page,
      sort,
      results: customers, // Les clients trouvés
      message: 'Requête de recherche de clients réussie',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while searching for customers.' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied. Only admin and manager can access this feature.' });
    }

    const customerId = req.params.id;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while retrieving the customer.' });
  }
};

const updateCustomerData = async (req, res) => {
  try {
    // Vérifie si l'utilisateur a le rôle "admin" ou "manager"
    if (!isAuthorizedUser(req, ['admin', 'manager'])) {
      return res.status(403).json({ message: 'Seuls les administrateurs et les gestionnaires peuvent effectuer cette action.' });
    }

    // Récupère les données de la requête
    const { firstName, lastName, email, role, active } = req.body;

    // Vérifie si l'adresse e-mail est unique, sauf si c'est l'adresse e-mail actuelle du client
    if (email) {
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer && existingCustomer._id != req.user._id) {
        return res.status(400).json({ message: 'Cet email est déjà enregistré.' });
      }
    }

    // Met à jour les données du client
    const updatedData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      role: role,
      active: active,
    };

    const updatedCustomer = await Customer.findByIdAndUpdate(req.user._id, updatedData, { new: true });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Client non trouvé.' });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour des données du client.' });
  }
};





module.exports = {
  searchForCustomer,
  getAllCustomers,
  loginCustomer,
  registerCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  deleteCustomerAccount,
  getCustomerById,
  sendValidationEmail,
  validateEmail,
  updateCustomerData,
};
