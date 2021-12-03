var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");
const url = process.env.DBURL;
const client = new MongoClient(url);
const dbName = process.env.DBNAME;

router.get("/", async function (req, res, next) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("users");

  await collection.find({},{ projection: { _id: 1, name: 1, email: 1 } }).toArray(function (err, result) {
    if (err) throw err;
    res.json(result)
  });

});

module.exports = router;
