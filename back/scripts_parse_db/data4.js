const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "IPSSI_KBO";
let db;

// Stocker les codes et descriptions à partir de code.csv
let codeMap = new Map();

// Fonction pour lire et traiter code.csv
const processCodeCSV = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream('code.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.Language === "FR") {
          const key = `${row.Category}_${row.Code}`;
          codeMap.set(key, row.Description);
        }
      })
      .on('end', () => {
        console.log('Code map built from code.csv.');
        resolve();
      })
      .on('error', reject);
  });
};

// Fonction pour remplacer les codes dans les champs pertinents d'une entreprise
const replaceCodesInEnterprise = (enterprise) => {
  let updated = false;

  // Remplacement dans info (Status, JuridicalSituation, TypeOfEnterprise, etc.)
  const infoFields = ['Status', 'JuridicalSituation', 'TypeOfEnterprise', 'JuridicalForm', 'JuridicalFormCAC'];
  for (const field of infoFields) {
    if (enterprise.info && enterprise.info[field]) {
      const key = `${field}_${enterprise.info[field]}`;
      if (codeMap.has(key)) {
        enterprise.info[field] = codeMap.get(key);
        updated = true;
      }
    }
  }

  // Remplacement dans denomination
  if (enterprise.denomination && Array.isArray(enterprise.denomination)) {
    for (let denomination of enterprise.denomination) {
      const typeKey = `TypeOfDenomination_${denomination.TypeOfDenomination}`;
      const languageKey = `Language_${denomination.Language}`;
      if (codeMap.has(typeKey)) {
        denomination.TypeOfDenomination = codeMap.get(typeKey);
        updated = true;
      }
      if (codeMap.has(languageKey)) {
        denomination.Language = codeMap.get(languageKey);
        updated = true;
      }
    }
  }

  // Remplacement dans contact
  if (enterprise.contact && Array.isArray(enterprise.contact)) {
    for (let contact of enterprise.contact) {
      const key = `ContactType_${contact.ContactType}`;
      if (codeMap.has(key)) {
        contact.ContactType = codeMap.get(key);
        updated = true;
      }
    }
  }

  // Remplacement dans address
  if (enterprise.address && Array.isArray(enterprise.address)) {
    for (let address of enterprise.address) {
      const key = `TypeOfAddress_${address.TypeOfAddress}`;
      if (codeMap.has(key)) {
        address.TypeOfAddress = codeMap.get(key);
        updated = true;
      }
    }
  }

  // Remplacement dans activity
  if (enterprise.activity && Array.isArray(enterprise.activity)) {
    for (let activity of enterprise.activity) {
      const activityFields = ['ActivityGroup', 'NaceVersion', 'NaceCode', 'Classification'];
      for (const field of activityFields) {
        const key = `${field}_${activity[field]}`;
        if (codeMap.has(key)) {
          activity[field] = codeMap.get(key);
          updated = true;
        }
      }
    }
  }

  return updated;
};

// Fonction pour mettre à jour les entreprises dans la base de données
const updateEnterpriseCollection = async () => {
  const enterpriseCollection = db.collection('enterprise');
  const cursor = enterpriseCollection.find();
  let totalUpdated = 0;

  while (await cursor.hasNext()) {
    const enterprise = await cursor.next();
    const updated = replaceCodesInEnterprise(enterprise);

    if (updated) {
      await enterpriseCollection.updateOne(
        { _id: enterprise._id },
        { $set: enterprise }
      );
      totalUpdated++;
      console.log(`Updated enterprise with _id: ${enterprise._id}`);
    }
  }

  console.log(`${totalUpdated} enterprises updated.`);
};

// Fonction principale
const run = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    // Traitement des codes
    await processCodeCSV();

    // Mise à jour de la collection enterprise
    await updateEnterpriseCollection();

    console.log('All codes replaced successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
};

// Lancement du script
run();
