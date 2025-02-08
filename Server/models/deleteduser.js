const mongoose = require("mongoose");

const deletedUserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  deletedAt: { type: Date, required: true },
});

const DeletedUserModel = mongoose.model("deleteduser", deletedUserSchema);

module.exports = { DeletedUserModel };
