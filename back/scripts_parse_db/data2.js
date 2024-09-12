const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "IPSSI_KBO";
let db;

let batchSize = 10000; // Augmenter la taille des lots pour optimiser les performances
let activityBatch = []; // Batch d'activités à insérer
let totalProcessed = 0; // Compteur pour le nombre total de lignes traitées

// Fonction pour lire et traiter activity.csv
const processActivityCSV = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream('activity.csv')
      .pipe(csv())
      .on('data', (row) => {
        activityBatch.push({
          EntityNumber: row.EntityNumber,
          ActivityGroup: row.ActivityGroup,
          NaceVersion: row.NaceVersion,
          NaceCode: row.NaceCode,
          Classification: row.Classification
        });

        // Si le lot atteint la taille définie, on traite ce lot
        if (activityBatch.length >= batchSize) {
          processBatch(activityBatch);
          totalProcessed += activityBatch.length;
          console.log(`Processed ${totalProcessed} rows so far...`);
          activityBatch = []; // Réinitialiser le lot après traitement
        }
      })
      .on('end', async () => {
        if (activityBatch.length > 0) {
          await processBatch(activityBatch); // Traiter le dernier lot s'il reste des données
          totalProcessed += activityBatch.length;
          console.log(`Processed ${totalProcessed} rows in total.`);
        }
        resolve();
      })
      .on('error', reject);
  });
};

// Fonction pour traiter un lot de données
const processBatch = async (batch) => {
  const bulkOperations = batch.map(activity => ({
    updateOne: {
      filter: { enterpriseNumber: activity.EntityNumber },
      update: { $push: { activity: activity } }
    }
  }));

  const enterpriseCollection = db.collection('enterprise');

  try {
    const result = await enterpriseCollection.bulkWrite(bulkOperations);
    console.log(`Batch processed: ${result.modifiedCount} enterprises updated.`);
  } catch (error) {
    console.error('Error processing batch:', error);
  }
};

// Fonction principale
const run = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    // Ajout de l'index sur enterpriseNumber pour optimiser les recherches
    await db.collection('enterprise').createIndex({ enterpriseNumber: 1 });
    console.log('Index on enterpriseNumber created.');

    // Traitement des données d'activité
    await processActivityCSV();

    console.log('All activities merged successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
};

// Lancement du script
run();
