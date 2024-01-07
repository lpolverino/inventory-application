const Product = require("../models/product");
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");


exports.index = asyncHandler(async (req, res, next) => {
    const [
      numProducts,
      numCategories,
    ] = await Promise.all([
      Product.countDocuments({}).exec(),
      Category.countDocuments({}).exec()
    ]);

    console.log(numCategories);
  
    res.render("index", {
      title: "Computer Store",
      product_count: numProducts,
      categories_count: numCategories,
    });
  });
  
// Display list of all products.
exports.product_list = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find().sort({ name: 1 }).exec();
  res.render("product_list", {
    title: "Product List",
    products_list: allProducts,
  });
});

// Display detail page for a specific product.
exports.product_detail = asyncHandler(async (req, res, next) => {
  const [product] = await Promise.all([
    Product.findById(req.params.id).populate("category").exec(),
  ]);

  if (product === null) {
    // No results.
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  res.render("product_detail", {
    title: product.name,
    product: product
  });
});

// Display product create form on GET.
exports.product_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product create GET");
});

// Handle product create on POST.
exports.product_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product create POST");
});

// Display product delete form on GET.
exports.product_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product delete GET");
});

// Handle product delete on POST.
exports.product_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product delete POST");
});

// Display product update form on GET.
exports.product_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product update GET");
});

// Handle product update on POST.
exports.product_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product update POST");
});
