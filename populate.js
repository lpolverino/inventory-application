#! /usr/bin/env node

console.log(
    "This script populates some products and categories to your database"
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Product = require("./models/product");
  const Category = require("./models/category");
  
  const products = []
  const categories = []
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createProducts();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, name, description) {
    const category = new Category({ name: name, description:description });
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }
  
  async function productCreate(index, name, description, price, stock_number, category) {
    const productDetail = {
      name:name,
      description:description,
      price: price,
      number_stock:stock_number
    };
    if (category != false) productDetail.category = category;
  
    const product = new Product(productDetail);
    await product.save();
    products[index] = product;
    console.log(`Added product: ${name}`);
  }

  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate(0, "Processor", "AMD, Intel and other"),
      categoryCreate(1, "Memory", "Ram, HDD , SDD"),
      categoryCreate(2, "Graphic Cards", "Nvidia, AMD and others"),
    ]);
  }
  
  async function createProducts() {
    console.log("Adding Products");
    await Promise.all([
      productCreate(0,
        "Intel i5 2.4ghz",
        "the i5 generation inel proccesor with quad core running each in 2.4ghz",
        200,
        5,
        [categories[0]]
      ),
      productCreate(1,
        "AMD RADEON 24 3ghz",
        "the Radeon 24 model of the AMD processor with quad core running  in total of 3ghz",
        150,
        8,
        [categories[0]]
      ),
      productCreate(2,
        "Kingstone RAM 8gb ddr5",
        "The new Memory of the Kingstone bracnh with 8gb of available memory using the new ports of ddr5",
        40,
        10,
        [categories[1]]
      ),
      productCreate(3,
        "Kingstone HDD 1TB",
        "Hard disk of 1TB manufactered by Kingstone",
        30,
        20,
        [categories[1]]
      ),
      productCreate(4,
        "Kingstone SDD 120GB",
        "Solid disk of 120gb manufactered by Kingstone",
        40,
        15,
        [categories[1]]
      ),
      productCreate(5,
        "NVIDEA GTX 1050 1GB",
        "THe new generation of nvidea graphic cards for running the new motor CUDA",
        100,
        10,
        [categories[2]]
      ),
      productCreate(6,
        "AMD rx 3000 512Mb",
        "AMD classic graphic card capeable of running high demand software and video games",
        80,
        15,
        [categories[2]]
      ),
    ]);
  }
  