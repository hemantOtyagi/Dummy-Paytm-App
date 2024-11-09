const mongoose = require("mongoose");
const { Schema } = mongoose.Schema;

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  balance: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Account", accountSchema);
