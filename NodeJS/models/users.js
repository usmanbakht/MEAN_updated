const mongoose = require("mongoose");

var users = mongoose.model("users", {
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  password: { type: String },
});

module.exports = { users };
