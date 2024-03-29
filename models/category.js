const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Categorychema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 100 },
});

Categorychema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/category/${this._id}`;
  });


// Export model
module.exports = mongoose.model("Category", Categorychema);