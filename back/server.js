const express = require('express');
const cors = require('cors'); // Importer le middleware CORS
const app = express();
const port = 3000; // Le port sur lequel ton serveur va tourner

app.use(cors()); // Activer CORS pour toutes les routes

const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/IPSSI_KBO', {
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


// Middleware pour parser les requêtes JSON
app.use(express.json());

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const Enterprise = require('./models/enterprise');
const Branch = require('./models/branch');  // Assure-toi d'importer le modèle Branch
const Establishment = require('./models/establishment');  // Assure-toi d'importer le modèle Establishment

// Recherche d'entreprise par nom ou numéro
app.get('/api/enterprises/search', async (req, res) => {
  try {
    const query = req.query.name;
    const page = parseInt(req.query.page) || 1; // Page actuelle, par défaut 1
    const limit = 20; // Nombre de résultats par page
    const skip = (page - 1) * limit; // Nombre de résultats à sauter

    if (!query) {
      return res.status(400).json({ error: 'Le paramètre de recherche "name" est requis.' });
    }

    console.log(`Search query received: ${query}`);

    // Déterminer si la requête est un enterpriseNumber (format avec points entre les chiffres)
    const isEnterpriseNumber = /^[0-9]{4}\.[0-9]{3}\.[0-9]{3}$/.test(query);

    let enterprises;
    let totalEnterprises;

    if (isEnterpriseNumber) {
      // Recherche exacte sur enterpriseNumber avec pagination
      enterprises = await Enterprise.find({ enterpriseNumber: query })
                                    .skip(skip) // Ignorer les premiers résultats
                                    .limit(limit); // Limiter à 20 résultats

      // Compter le nombre total d'entreprises correspondantes au numéro
      totalEnterprises = await Enterprise.countDocuments({ enterpriseNumber: query });
    } else {
      // Recherche insensible à la casse sur enterpriseName avec pagination
      enterprises = await Enterprise.find({
        enterpriseName: { $regex: query, $options: 'i' }
      })
      .skip(skip)
      .limit(limit);

      // Compter le nombre total d'entreprises correspondant au nom
      totalEnterprises = await Enterprise.countDocuments({
        enterpriseName: { $regex: query, $options: 'i' }
      });
    }

    console.log('Enterprises found:', enterprises);

    const totalPages = Math.ceil(totalEnterprises / limit);

    res.json({
      page,
      totalPages,
      totalEnterprises,
      enterprises
    });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche.' });
  }
});
  

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


  
  