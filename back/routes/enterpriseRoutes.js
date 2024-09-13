const express = require('express');
const router = express.Router();
const enterpriseController = require('../controllers/enterpriseController');

// Route pour la recherche d'entreprises
router.get('/search', enterpriseController.searchEnterprise);

module.exports = router;
