const category = require("../models/category");
const Category = require("../models/category");
const Product = require("../models/product")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all categorys.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

// Display detail page for a specific category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, productsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }, "name description").exec(),
  ]);
  if (category === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_products: productsInCategory,
  });
});

// Display category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

// Handle category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Category name must contain at least 3 characters"),
  body("description")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Category name must contain at least 3 characters"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new Category({ name: req.body.name , description: req.body.description});

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const categoryExists = await Category.findOne({ name: req.body.name }).exec();
      if (categoryExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(category.url);
      }
    }
  }),
];

// Display category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allProductsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({category:req.params.id}, "name description").exec()
  ]);

  if (category === null){
    res.redirect("/catalog/category");
  }

  res.render("category_delete", {
    title:"Delete Category",
    category: category,
    category_products: allProductsInCategory,
  });
});

// Handle category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allProductsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({category:req.params.id}, "name description").exec()
  ]);

  if (allProductsInCategory.length > 0) {
    res.render("category_delete", {
      title:"Delete Category",
      category: category,
      category_products: allProductsInCategory,
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/catalog/category");
  }
});

// Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update GET");
});

// Handle category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update POST");
});
