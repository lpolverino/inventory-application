const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 100 },
  price: { type: Number },
  number_stock: { type: Number },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

ProductSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/product/${this._id}`;
  });


// Export model
module.exports = mongoose.model("Product", ProductSchema);