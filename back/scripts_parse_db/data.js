const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

// Connexion à MongoDB
const uri = "mongodb://localhost:27017"; // À adapter selon ta configuration
const client = new MongoClient(uri);
const dbName = "IPSSI_KBO"; // Nom de la base de données
let db;

// Variables de compteur pour les logs
let enterpriseCounter = 0;
let branchCounter = 0;
let establishmentCounter = 0;

// Map pour stocker temporairement les données à merger
let enterpriseMap = new Map();
let establishmentMap = new Map();
let branchMap = new Map();

// Fonction pour lire un CSV
const readCSV = (filePath, processRow, label) => {
  console.time(`Reading ${label}`);
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => processRow(row))
      .on('end', () => {
        console.timeEnd(`Reading ${label}`);
        resolve();
      })
      .on('error', reject);
  });
};

// Traitement du fichier enterprise.csv
const processEnterpriseCSV = () => {
  return readCSV('enterprise.csv', (row) => {
    enterpriseMap.set(row.EnterpriseNumber, {
      enterpriseNumber: row.EnterpriseNumber,
      info: {
        Status: row.Status,
        JuridicalSituation: row.JuridicalSituation,
        TypeOfEnterprise: row.TypeOfEnterprise,
        JuridicalForm: row.JuridicalForm,
        JuridicalFormCAC: row.JuridicalFormCAC,
        StartDate: row.StartDate
      },
      contact: [],
      address: [],
      denomination: []
    });
  }, "enterprise.csv");
};

// Traitement du fichier establishment.csv
const processEstablishmentCSV = () => {
  return readCSV('establishment.csv', (row) => {
    establishmentMap.set(row.EstablishmentNumber, {
      establishmentNumber: row.EstablishmentNumber,
      enterpriseNumber: row.EnterpriseNumber,
      StartDate: row.StartDate,
      contact: [],
      address: [],
      denomination: []
    });
  }, "establishment.csv");
};

// Traitement du fichier branch.csv
const processBranchCSV = () => {
  return readCSV('branch.csv', (row) => {
    branchMap.set(row.Id, {
      branchId: row.Id,
      enterpriseNumber: row.EnterpriseNumber,
      StartDate: row.StartDate,
      address: [],
      denomination: []
    });
  }, "branch.csv");
};

// Fusion des données address.csv, contact.csv et denomination.csv avec enterprise et establishment
const mergeCSVData = async () => {
  // Fusion des adresses
  await readCSV('address.csv', (row) => {
    const entity = row.EntityNumber;
    const address = {
      TypeOfAddress: row.TypeOfAddress,
      Zipcode: row.Zipcode,
      Municipality: row.MunicipalityFR,
      Street: row.StreetFR,
      HouseNumber: row.HouseNumber
    };

    // Ajouter à enterprise
    if (enterpriseMap.has(entity)) {
      enterpriseMap.get(entity).address.push(address);
    }
    // Ajouter à establishment
    if (establishmentMap.has(entity)) {
      establishmentMap.get(entity).address.push(address);
    }
    // Ajouter à branch
    if (branchMap.has(entity)) {
      branchMap.get(entity).address.push(address);
    }
  }, "address.csv");

  // Fusion des contacts
  await readCSV('contact.csv', (row) => {
    const entity = row.EntityNumber;
    const contact = {
      ContactType: row.ContactType,
      Value: row.Value
    };

    // Ajouter à enterprise
    if (enterpriseMap.has(entity)) {
      enterpriseMap.get(entity).contact.push(contact);
    }
    // Ajouter à establishment
    if (establishmentMap.has(entity)) {
      establishmentMap.get(entity).contact.push(contact);
    }
  }, "contact.csv");

  // Fusion des dénominations
  await readCSV('denomination.csv', (row) => {
    const entity = row.EntityNumber;
    const denomination = {
      Language: row.Language,
      TypeOfDenomination: row.TypeOfDenomination,
      Denomination: row.Denomination
    };

    // Ajouter à enterprise
    if (enterpriseMap.has(entity)) {
      enterpriseMap.get(entity).denomination.push(denomination);
    }
    // Ajouter à establishment
    if (establishmentMap.has(entity)) {
      establishmentMap.get(entity).denomination.push(denomination);
    }
    // Ajouter à branch
    if (branchMap.has(entity)) {
      branchMap.get(entity).denomination.push(denomination);
    }
  }, "denomination.csv");
};

// Insérer les données dans MongoDB
const insertDataToMongo = async () => {
  console.log('Inserting data into MongoDB...');

  const enterpriseCollection = db.collection('enterprise');
  const branchCollection = db.collection('branch');
  const establishmentCollection = db.collection('establishment');

  // Insertion des entreprises
  const enterpriseData = Array.from(enterpriseMap.values());
  await enterpriseCollection.insertMany(enterpriseData);
  enterpriseCounter += enterpriseData.length;
  console.log(`${enterpriseCounter} enterprises inserted.`);

  // Insertion des branches
  const branchData = Array.from(branchMap.values());
  await branchCollection.insertMany(branchData);
  branchCounter += branchData.length;
  console.log(`${branchCounter} branches inserted.`);

  // Insertion des établissements
  const establishmentData = Array.from(establishmentMap.values());
  await establishmentCollection.insertMany(establishmentData);
  establishmentCounter += establishmentData.length;
  console.log(`${establishmentCounter} establishments inserted.`);
};

// Fonction principale
const run = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    // Traitement des fichiers CSV et fusions
    await processEnterpriseCSV();
    await processEstablishmentCSV();
    await processBranchCSV();
    await mergeCSVData();

    // Insertion des données dans MongoDB
    await insertDataToMongo();

    console.log('All CSV data processed and inserted successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
};

run();
