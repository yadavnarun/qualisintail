var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

var jwt = require("jsonwebtoken");

const { MongoClient } = require("mongodb");
const url = process.env.DBURL;
const client = new MongoClient(url);
const dbName = process.env.DBNAME;

router.get("/", async function (req, res, next) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("todo");

  let exsit = true;

  const id = req.query.id;
  collection.findOne({ user: id }, (err, doc) => {
    if (err) return err;

    exsit = doc != null;

    if (exsit) {
      res.send(doc.data);
    } else {
      const data = {
        user: id,
        data: {
          sample: ["text"],
        },
      };

      collection.insertOne(data).then(res.send(data.data)).catch(console.log);
    }
  });
});

router.patch("/", async function (req, res, next) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("todo");

  const { id, key, add, remove, update, from, to, token } = req.body;

  try {
    var decoded = jwt.verify(token, process.env.SECRET);
  } catch (err) {
    console.log(err);
    decoded = { _id: "malicious" };
  }

  if (id === decoded._id) {
    if (key) {
      if (add) {
        collection
          .updateOne(
            { user: id },
            {
              $push: {
                ["data." + key]: add,
              },
            }
          )
          .then(res.send({ message: "inserted" }))
          .catch(console.log);
      } else if (remove && !update) {
        collection
          .updateOne(
            { user: id },
            {
              $pull: {
                ["data." + key]: remove,
              },
            }
          )
          .then(res.send({ message: "remove" }))
          .catch(console.log);
      } else if (update) {
        collection
          .updateOne(
            { user: id },
            {
              $set: {
                ["data." + key + "." + remove]: [update],
              },
            }
          )
          .then(res.send({ message: "remove" }))
          .catch(console.log);
      }
    } else {
      if (add) {
        let exsit;

        collection.findOne(
          { user: id, ["data." + add]: { $ne: null } },
          (err, doc) => {
            if (err) return err;

            exsit = doc != null;

            if (exsit) {
              res.send({ message: "taken" });
            } else {
              collection
                .updateOne(
                  { user: id },
                  {
                    $set: {
                      ["data." + add]: [],
                    },
                  }
                )
                .then(res.send({ message: "inserted" }))
                .catch(console.log);
            }
          }
        );
      } else if (remove) {
        collection
          .updateOne(
            { user: id },
            {
              $unset: {
                ["data." + remove]: "",
              },
            }
          )
          .then(res.send({ message: "remove" }))
          .catch(console.log);
      } else if ((from, to)) {
        if (from[0] === to[0]) {
          collection
            .updateOne(
              { user: id },
              {
                $set: {
                  ["data." + to[0]]: [...to[1]],
                },
              }
            )
            .then(res.send({ message: "done" }))
            .catch(console.log);
        } else {
          collection
            .updateOne(
              { user: id },
              {
                $set: {
                  ["data." + to[0]]: [...to[1]],
                  ["data." + from[0]]: [...from[1]],
                },
              }
            )
            .then(res.send({ message: "done" }))
            .catch(console.log);
        }
      }
    }
  } else {
    res.send({ message: "error" });
  }
});

module.exports = router;
