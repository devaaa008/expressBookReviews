const { MongoClient } = require("mongodb");
const pass = "Devu0380";
const uri =
  "mongodb+srv://devaaa008:Devu0380@myatlasclusteredu.m9xukns.mongodb.net/?retryWrites=true&w=majority";

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
