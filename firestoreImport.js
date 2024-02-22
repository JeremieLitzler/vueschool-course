// Imports
import { initializeFirebaseApp, restore } from "firestore-export-import";
import { firebaseConfig } from "./src/config/firebase.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccount.json", "utf8")
);
const tempFileName = `${__dirname}/data-temp.json`;

// procedure
(async () => {
  const fileContents = fs.readFileSync(`${__dirname}/src/data.json`, "utf8");
  const data = JSON.parse(fileContents);
  const transformed = transformDataForFirestore(data);
  fs.writeFileSync(tempFileName, JSON.stringify(transformed));
  await jsonToFirestore();
  fs.unlinkSync(tempFileName);
})();

// Helper Functions
// -------------------------------------

// JSON To Firestore
async function jsonToFirestore() {
  try {
    console.log("Initialzing Firebase");
    const firestore = await initializeFirebaseApp(
      serviceAccount,
      firebaseConfig.databaseURL
    );
    console.log("Firebase Initialized");

    await restore(firestore, tempFileName);
    console.log("Upload Success");
  } catch (error) {
    console.log(error);
  }
}

// In order to preserve ids in data.json
// as ids in firestore
// must use keyed object (id being the key) instead of array of records
function transformDataForFirestore(data) {
  const collections = data;
  delete collections.stats;
  const collectionsById = {};
  Object.keys(collections).forEach((collectionKey) => {
    collectionsById[collectionKey] = {};
    const collection = collections[collectionKey];
    collection.forEach((record) => {
      collectionsById[collectionKey][record.id] = record;
      delete collectionsById[collectionKey][record.id].id;
    });
  });
  return collectionsById;
}
