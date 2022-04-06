const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: false,
  },
});

module.exports = { Category: mongoose.model("category", CategorySchema) };
