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

// Fonction pour remplacer les codes dans les champs pertinents d'une branche
const replaceCodesInBranch = (branch) => {
  let updated = false;

  // Remplacement dans address
  if (branch.address && Array.isArray(branch.address)) {
    for (let address of branch.address) {
      const key = `TypeOfAddress_${address.TypeOfAddress}`;
      if (codeMap.has(key)) {
        address.TypeOfAddress = codeMap.get(key);
        updated = true;
      }
    }
  }

  // Remplacement dans denomination
  if (branch.denomination && Array.isArray(branch.denomination)) {
    for (let denomination of branch.denomination) {
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

  return updated;
};

// Fonction pour mettre à jour les branches dans la base de données
const updateBranchCollection = async () => {
  const branchCollection = db.collection('branch');
  const cursor = branchCollection.find();
  let totalUpdated = 0;

  while (await cursor.hasNext()) {
    const branch = await cursor.next();
    const updated = replaceCodesInBranch(branch);

    if (updated) {
      await branchCollection.updateOne(
        { _id: branch._id },
        { $set: branch }
      );
      totalUpdated++;
      console.log(`Updated branch with _id: ${branch._id}`);
    }
  }

  console.log(`${totalUpdated} branches updated.`);
};

// Fonction principale
const run = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    // Traitement des codes
    await processCodeCSV();

    // Mise à jour de la collection branch
    await updateBranchCollection();

    console.log('All codes replaced successfully in the branch collection.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
};

// Lancement du script
run();
