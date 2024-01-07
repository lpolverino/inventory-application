const Product = require("../models/product");
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");
const product = require("../models/product");


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
  const categories = await Category.find().exec()

  res.render("product_form", {
    title: "Create Product",
    categories:categories,
  });
});

// Handle product create on POST.
exports.product_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "description must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("price", "Price should be a not empty number")
    .trim()
    .toFloat()
    .isFloat({min:0})
    .escape(),
  body("number_stock", "stock should be a positive integer").trim().isInt({min:0}).escape(),
  body("category.*").escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    console.log(req.body.price);

    // Create a Book object with escaped and trimmed data.
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      number_stock: req.body.number_stock,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      const categories = await Category.find().exec()

      // Mark our selected genres as checked.
      for (const category of categories) {
        if (product.category.includes(category._id)) {
          category.checked = "true";
        }
      }
      res.render("product_form", {
        title: "Create Product",
        categories: categories,
        product:product,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await product.save();
      res.redirect(product.url);
    }
  }),
];
// Display product delete form on GET.
exports.product_delete_get = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec()
  if (product === null){
    res.redirect("/catalog/product")
  }
  else{
    res.render("product_delete", {
      title:"Delete Product",
      product: product,
    });
  }

});

// Handle product delete on POST.
exports.product_delete_post = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec()
  if (product === null){
    res.redirect("/catalog/product")
  }
  else{
    await Product.findByIdAndDelete(req.body.productid);
    res.redirect("/catalog/product")
  }
});


// Display product update form on GET.
exports.product_update_get = asyncHandler(async (req, res, next) => {
  const [product, categories] = await Promise.all([
    Product.findById(req.params.id).exec(),
    Category.find().sort({ name: 1 }).exec()
  ]);

  if (product === null) {
    // No results.
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  
  categories.forEach((cat) => {
    if (product.category.includes(cat._id)) cat.checked = "true";
  });
 

  res.render("product_form", { title: "Update Product", product:product, categories: categories });
});

// Handle product update on POST.
exports.product_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "description must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("price", "Price should be a not empty number")
    .trim()
    .toFloat()
    .isFloat({min:0})
    .escape(),
  body("number_stock", "stock should be a positive integer").trim().isInt({min:0}).escape(),
  body("category.*").escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      number_stock: req.body.number_stock,
      category: req.body.category,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      const categories = await Category.find().exec()

      // Mark our selected genres as checked.
      for (const category of categories) {
        if (product.category.includes(category._id)) {
          category.checked = "true";
        }
      }
      res.render("product_form", {
        title: "Create Product",
        categories: categories,
        product:product,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Save book.
      const updateProduct = await Product.findByIdAndUpdate(req.params.id, product, {});
      res.redirect(updateProduct.url);
    }
  }),
];