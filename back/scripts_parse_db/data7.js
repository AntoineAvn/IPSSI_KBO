const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "IPSSI_KBO";

const updateEnterpriseNames = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const enterpriseCollection = db.collection('enterprise');

    const cursor = enterpriseCollection.find(); // Trouver toutes les entreprises
    let totalUpdated = 0;

    while (await cursor.hasNext()) {
      const enterprise = await cursor.next();
      let enterpriseName = '';

      // Chercher une dénomination avec TypeOfDenomination = "Dénomination"
      const denominationEntry = enterprise.denomination.find(
        (denomination) => denomination.TypeOfDenomination === "Dénomination"
      );

      if (denominationEntry) {
        // Si on trouve une dénomination avec TypeOfDenomination = "Dénomination"
        enterpriseName = denominationEntry.Denomination;
      } else if (enterprise.denomination.length > 0) {
        // Sinon, on prend le dernier dans la liste
        enterpriseName = enterprise.denomination[enterprise.denomination.length - 1].Denomination;
      }

      if (enterpriseName) {
        // Mise à jour de l'entreprise avec enterpriseName
        await enterpriseCollection.updateOne(
          { _id: enterprise._id },
          { $set: { enterpriseName: enterpriseName } }
        );
        totalUpdated++;
        console.log(`Updated enterprise with _id: ${enterprise._id}`);
      }
    }

    console.log(`${totalUpdated} enterprises updated with enterpriseName.`);
  } catch (error) {
    console.error('Error updating enterprise names:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
};

// Exécuter le script
updateEnterpriseNames();
