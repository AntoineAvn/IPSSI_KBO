const express = require('express');
const app = express();
const port = 3000; // Le port sur lequel ton serveur va tourner

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
    if (!query) {
      return res.status(400).json({ error: 'Le paramètre de recherche "name" est requis.' });
    }

    console.log(`Search query received: ${query}`);

    // Déterminer si la requête est un enterpriseNumber (format avec points entre les chiffres)
    const isEnterpriseNumber = /^[0-9]{4}\.[0-9]{3}\.[0-9]{3}$/.test(query);

    let enterprises;
    if (isEnterpriseNumber) {
      // Recherche exacte sur enterpriseNumber
      enterprises = await Enterprise.find({ enterpriseNumber: query });
    } else {
      // Recherche insensible à la casse sur enterpriseName
      enterprises = await Enterprise.find({
        enterpriseName: { $regex: query, $options: 'i' }
      });
    }

    console.log('Enterprises found:', enterprises);

    const enterpriseDetails = await Promise.all(enterprises.map(async (enterprise) => {
      const branches = await Branch.find({ enterpriseNumber: enterprise.enterpriseNumber });
      const establishments = await Establishment.find({ enterpriseNumber: enterprise.enterpriseNumber });
      return {
        ...enterprise._doc,
        branches,
        establishments
      };
    }));

    res.json(enterpriseDetails);
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche.' });
  }
});




// app.get('/api/enterprise', async (req, res) => {
//     try {
//       console.log('Request received for /api/enterprise');
//       const enterprise = await Enterprise.findOne(); // Récupérer une entreprise
//       console.log('Enterprise found:', enterprise);
//       res.json(enterprise);
//     } catch (error) {
//       console.error('Error fetching enterprise:', error); // Afficher l'erreur complète
//       res.status(500).json({ error: 'Erreur lors de la récupération des entreprises' });
//     }
//   });
  

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


  
  