const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function getClient() {
  await client.connect();
  return client;
}
async function getBooksCollection() {
  try {
    // Connect to the MongoDB server
    const client = await getClient();

    const collection = client.db("Library").collection("BookReviews");
    return collection;
  } catch (err) {
    throw new Error(err);
  }
}

async function getCustomerCollection() {
  try {
    // Connect to the MongoDB server
    const client = await getClient();

    const collection = client.db("Library").collection("Customers");
    return collection;
  } catch (err) {
    throw new Error(err);
  }
}
module.exports = { getBooksCollection, getCustomerCollection };
