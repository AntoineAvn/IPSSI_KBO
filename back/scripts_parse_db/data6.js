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

// Fonction pour remplacer les codes dans les champs pertinents d'un établissement
const replaceCodesInEstablishment = (establishment) => {
  let updated = false;

  // Remplacement dans contact
  if (establishment.contact && Array.isArray(establishment.contact)) {
    for (let contact of establishment.contact) {
      const key = `ContactType_${contact.ContactType}`;
      if (codeMap.has(key)) {
        contact.ContactType = codeMap.get(key);
        updated = true;
      }
    }
  }

  // Remplacement dans address
  if (establishment.address && Array.isArray(establishment.address)) {
    for (let address of establishment.address) {
      const key = `TypeOfAddress_${address.TypeOfAddress}`;
      if (codeMap.has(key)) {
        address.TypeOfAddress = codeMap.get(key);
        updated = true;
      }
    }
  }

  // Remplacement dans denomination
  if (establishment.denomination && Array.isArray(establishment.denomination)) {
    for (let denomination of establishment.denomination) {
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

  // Remplacement dans activity
  if (establishment.activity && Array.isArray(establishment.activity)) {
    for (let activity of establishment.activity) {
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

// Fonction pour mettre à jour les établissements dans la base de données
const updateEstablishmentCollection = async () => {
  const establishmentCollection = db.collection('establishment');
  const cursor = establishmentCollection.find();
  let totalUpdated = 0;

  while (await cursor.hasNext()) {
    const establishment = await cursor.next();
    const updated = replaceCodesInEstablishment(establishment);

    if (updated) {
      await establishmentCollection.updateOne(
        { _id: establishment._id },
        { $set: establishment }
      );
      totalUpdated++;
      console.log(`Updated establishment with _id: ${establishment._id}`);
    }
  }

  console.log(`${totalUpdated} establishments updated.`);
};

// Fonction principale
const run = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    // Traitement des codes
    await processCodeCSV();

    // Mise à jour de la collection establishment
    await updateEstablishmentCollection();

    console.log('All codes replaced successfully in the establishment collection.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
};

// Lancement du script
run();
