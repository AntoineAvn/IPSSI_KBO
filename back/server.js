const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware pour activer CORS et parser les requêtes JSON
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/IPSSI_KBO', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Importation des routes
const enterpriseRoutes = require('./routes/enterpriseRoutes');

// Utilisation des routes
app.use('/api/enterprises', enterpriseRoutes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
