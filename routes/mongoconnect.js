const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");
const url = process.env.DBURL;
const client = new MongoClient(url);
const dbName = client.db(process.env.DBNAME);

(async () => {
  await client.connect().then(() => {
    console.log("connected");
    dbName
      .collection("pastew")
      .createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });
  });
})();

module.exports = {
  db: function () {
    return dbName;
  },
};
