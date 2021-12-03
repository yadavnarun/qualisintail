var express = require("express");
var router = express.Router();
var mongoconnect = require("./mongoconnect");
var jwt = require("jsonwebtoken");

const ObjectId = require("mongodb").ObjectId;

router.get("/:id", async function (req, res, next) {
  const collection = mongoconnect.db().collection("pastew");

  const mark_id = req.params.id;

  if (mark_id) {
    collection.findOne({ _id: new ObjectId(mark_id) }, (err, doc) => {
      if (err) return err;

      if (doc != null) {
        res.send({ message: doc.markdown });
      } else {
        res.send({ message: "invalid page" });
      }
    });
  } else {
    res.send({ message: "send { id }" });
  }
});

router.post("/", async function (req, res, next) {
  const collection = mongoconnect.db().collection("pastew");

  const { token, markdown } = req.body;
  if (token && markdown) {
    try {
      var decoded = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      console.log(err);
    }

    if (decoded) {
      collection
        .insertOne({
          user: decoded._id,
          markdown: markdown,
          createdAt: new Date(),
        })
        .then((doc) => res.send({ message: doc.insertedId }))
        .catch(console.error);
    } else {
      res.send({ message: "invalid request" });
    }
  } else {
    res.send({ message: "send {token, markdown}" });
  }
});

module.exports = router;
