const express = require("express");
const router = express.Router();

// Require controller modules.
const product_controller = require("../controlers/productsController");
const category_controller = require("../controlers/categoryControler");

/// product ROUTES ///

// GET catalog home page.
router.get("/", product_controller.index);

// GET request for creating a product. NOTE This must come before routes that display product (uses id).
router.get("/product/create", product_controller.product_create_get);

// POST request for creating product.
router.post("/product/create", product_controller.product_create_post);

// GET request to delete product.
router.get("/product/:id/delete", product_controller.product_delete_get);

// POST request to delete product.
router.post("/product/:id/delete", product_controller.product_delete_post);

// GET request to update product.
router.get("/product/:id/update", product_controller.product_update_get);

// POST request to update product.
router.post("/product/:id/update", product_controller.product_update_post);

// GET request for one product.
router.get("/product/:id", product_controller.product_detail);

// GET request for list of all product items.
router.get("/product", product_controller.product_list);

/// category ROUTES ///

// GET request for creating a category. NOTE This must come before route that displays category (uses id).
router.get("/category/create", category_controller.category_create_get);

//POST request for creating category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all category.
router.get("/category", category_controller.category_list);


module.exports = router;
