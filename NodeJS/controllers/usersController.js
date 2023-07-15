const express = require("express");
var router = express.Router();
var ObjectId = require("mongoose").Types.ObjectId;

var { users } = require("../models/users");

// => localhost:3000/employees/
router.get("/", (req, res) => {
  async function getUsers() {
    try {
      const docs = await users.find().exec();
      res.send(docs);
    } catch (err) {
      console.log(
        "Error in retrieving users: " + JSON.stringify(err, undefined, 2)
      );
    }
  }
  // Call the async function
  getUsers();
});
//find user by ID
router.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  try {
    const doc = await users.findById(req.params.id);
    if (doc) {
      res.send(doc);
    } else {
      console.log("Employee not found.");
      res.status(404).send("Employee not found.");
    }
  } catch (err) {
    console.log(
      "Error in Retrieving Employee: " + JSON.stringify(err, undefined, 2)
    );
    res.status(500).send("Error in Retrieving Employee.");
  }
});
//insert a user
router.post("/", async (req, res) => {
  var emp = new users({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const doc = await emp.save();
    res.send(doc);
  } catch (err) {
    console.log("Error in Employee Save: " + JSON.stringify(err, undefined, 2));
  }
});
//update user data
router.put("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  var emp = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  };
  users
    .findByIdAndUpdate(req.params.id, { $set: emp }, { new: true })
    .then((doc) => {
      if (doc) {
        res.send(doc);
      } else {
        console.log("Employee not found.");
        res.status(404).send("Employee not found.");
      }
    })
    .catch((err) => {
      console.log(
        "Error in Employee Update: " + JSON.stringify(err, undefined, 2)
      );
      res.status(500).send("Error in Employee Update.");
    });
});
//delete a user
router.delete("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  try {
    const doc = await users.findByIdAndRemove(req.params.id);
    if (doc) {
      res.send(doc);
    } else {
      console.log(`No record found with id: ${req.params.id}`);
      res.status(404).send(`No record found with id: ${req.params.id}`);
    }
  } catch (err) {
    console.log(
      "Error in Employee Delete :" + JSON.stringify(err, undefined, 2)
    );
    res.status(500).send("Error in Employee Delete.");
  }
});

module.exports = router;
