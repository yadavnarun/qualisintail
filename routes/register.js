var express = require("express");
var router = express.Router();
var mongoconnect = require("./mongoconnect");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

router.post("/", async function (req, res, next) {
  const collection = mongoconnect.db().collection("users");

  const { name, email, password } = req.body;
  if (name && email && password) {
    collection.findOne({ email: email }, (err, user) => {
      if (user) {
        res.send({ message: "exist" });
      } else {
        const myPlaintextPassword = password;

        bcrypt.hash(myPlaintextPassword, 10, function (err, hash) {
          if (err) return err;

          collection
            .insertOne({ name: name, email: email, password: hash })
            .then(res.send({ message: "registered successfully" }))
            .catch(console.error);
        });
      }
    });
  } else {
    res.send({ message: "send {name, email, password}" });
  }
});

module.exports = router;
