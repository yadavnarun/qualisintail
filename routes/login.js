var express = require("express");
var router = express.Router();
var mongoconnect = require("./mongoconnect");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
var jwt = require("jsonwebtoken");

router.post("/", async function (req, res, next) {
  const collection = mongoconnect.db().collection("users");

  const { email, password } = req.body;

  if (email && password) {
    const user = await collection
      .findOne({ email: email })
      .catch(console.error, () => res.send({ message: "error" }));

    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) return err;

        if (result) {
          var token = jwt.sign(
            { name: user.name, _id: user._id, email: user.email },
            process.env.SECRET
          );
          res.send({
            name: user.name,
            _id: user._id,
            email: user.email,
            token: token,
          });
        } else {
          res.send({ message: "wrong credentials" });
        }
      });
    } else {
      res.send({ message: "not registerd" });
    }
  } else {
    res.send({ message: "send { email, password }" });
  }
});

module.exports = router;
