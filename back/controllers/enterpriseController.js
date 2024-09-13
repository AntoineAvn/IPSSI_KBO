const Enterprise = require('../models/enterprise');
const Branch = require('../models/branch');
const Establishment = require('../models/establishment');

exports.searchEnterprise = async (req, res) => {
  try {
    const query = req.query.name;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({ error: 'Le paramètre de recherche "name" est requis.' });
    }

    // Déterminer si la requête est un numéro d'entreprise
    const isEnterpriseNumber = /^[0-9]{4}\.[0-9]{3}\.[0-9]{3}$/.test(query);

    let enterprises;
    let totalEnterprises;

    if (isEnterpriseNumber) {
      // Recherche par numéro d'entreprise
      enterprises = await Enterprise.find({ enterpriseNumber: query }).skip(skip).limit(limit);
      totalEnterprises = await Enterprise.countDocuments({ enterpriseNumber: query });
    } else {
      // Recherche par nom d'entreprise
      enterprises = await Enterprise.find({
        enterpriseName: { $regex: query, $options: 'i' }
      }).skip(skip).limit(limit);
      totalEnterprises = await Enterprise.countDocuments({
        enterpriseName: { $regex: query, $options: 'i' }
      });
    }

    // Récupérer les branches et les établissements pour chaque entreprise
    const enterpriseDetails = await Promise.all(enterprises.map(async (enterprise) => {
      const branches = await Branch.find({ enterpriseNumber: enterprise.enterpriseNumber });
      const establishments = await Establishment.find({ enterpriseNumber: enterprise.enterpriseNumber });
      return {
        ...enterprise._doc,
        branches,
        establishments
      };
    }));

    const totalPages = Math.ceil(totalEnterprises / limit);

    res.json({
      page,
      totalPages,
      totalEnterprises,
      enterprises: enterpriseDetails
    });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche.' });
  }
};
