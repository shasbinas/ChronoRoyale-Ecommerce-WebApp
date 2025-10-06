import { ObjectId } from "mongodb";
import collection from "../config/collection.js";
import connectToDatabase from "../config/db.js";
import { v7 as uuidv7 } from "uuid";
/* Get all products */
export const getAllProducts = async (req, res) => {
  console.log(">>>>> get all prodcuts funciuon worked>>>>>");
  try {
    const db = await connectToDatabase(process.env.DATABASE);
    const products = await db
      .collection(collection.PRODUCTS_COLLECTION)
      .find({})
      .toArray();

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const fetchAllProducts = async () => {
  const db = await connectToDatabase(process.env.DATABASE);
  return await db.collection(collection.PRODUCTS_COLLECTION).find({}).toArray();
};

/* Get single product by ID */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format." });
    }

    const db = await connectToDatabase(process.env.DATABASE);
    const product = await db
      .collection(collection.PRODUCTS_COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: error.message,
    });
  }
};

/* Create a new product */
export const createProduct = async (req, res) => {
  console.log("crete produt route working>>>>>>>>");
  try {
    const data = req.body;
    console.log(data);

    console.log(req.files); // array of files
    const pictures = req.files.map(
      (file) => `/userAssets/pictures/${file.filename}`
    );
    console.log(pictures);

    const productData = {
      name: data.name,
      shortDesc: data.shortDesc,
      description: data.description,
      category: data.category,
      brand: data.brand,
      price: data.price,
      discountPrice: data.discountPrice,
      stock: data.stock,
      rating: "",
      picturePath: pictures,
      thumbnail: "",
      status: data.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDelete: false,
    };

    console.log(productData);

    const db = await connectToDatabase(process.env.DATABASE);
    const result = await db
      .collection(collection.PRODUCTS_COLLECTION)
      .insertOne(productData);
    console.log(result);

    return res.redirect("/admin/products-list");
  } catch (error) {
    console.log(error);
  }
};

/* Update a product by ID */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format." });
    }

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is empty.",
      });
    }

    const { name, description, price, stock } = body;

    const updateData = {};
    if (name?.trim()) updateData.name = name.trim();
    if (description?.trim()) updateData.description = description.trim();
    if (!isNaN(price)) updateData.price = Number(price);
    if (!isNaN(stock)) updateData.stock = Number(stock);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update.",
      });
    }

    updateData.updatedAt = new Date();

    const db = await connectToDatabase(process.env.DATABASE);
    const result = await db
      .collection(collection.PRODUCTS_COLLECTION)
      .updateOne({ _id: new ObjectId(String(id)) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updateData,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/* Delete a product by ID */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format." });
    }

    const db = await connectToDatabase(process.env.DATABASE);
    const result = await db
      .collection(collection.PRODUCTS_COLLECTION)
      .deleteOne({ _id: new ObjectId(String(id)) });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
/**** */

// /* Get last 8 products for home page */
// export const getHomeProducts = async (req, res) => {
//   try {
//     const db = await connectToDatabase(process.env.DATABASE);

//     const products = await db
//       .collection(collection.PRODUCTS_COLLECTION)
//       .find({})
//       .sort({ createdAt: -1 }) // newest products first
//       .limit(8)
//       .toArray();

//     return res.status(200).json({ success: true, data: products });
//   } catch (error) {
//     console.error("Error fetching home products:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch home products",
//       error: error.message,
//     });
//   }
// };

/**
 * Fetch products from the database with optional filters, sorting, and limit
 * @param {Object} options - Options for fetching products
 * @param {string} [options.category] - Filter by category (e.g. "men", "women")
 * @param {string} [options.brand] - Filter by brand (e.g. "Rolex")
 * @param {string} [options.sort] - Sort type ("latest", "oldest", "random")
 * @param {number} [options.limit] - Max number of products to return
 * @returns {Promise<Array>} - Array of products
 */
export const getProductsData = async (options = {}) => {
  try {
    const db = await connectToDatabase(process.env.DATABASE);

    // Build filter dynamically
    const filter = { isDelete: false };
    if (options.category) filter.category = options.category;
    if (options.brand) filter.brand = options.brand;

    let products;

    // If sort = random → use aggregation to return random products
    if (options.sort === "random") {
      products = await db
        .collection(collection.PRODUCTS_COLLECTION)
        .aggregate([
          { $match: filter }, // Apply filters
          { $sample: { size: options.limit || 20 } }, // Random selection
        ])
        .toArray();
    } else {
      // Sort by creation date
      let sortOption = { createdAt: -1 }; // latest first by default
      if (options.sort === "oldest") sortOption = { createdAt: 1 };

      let query = db
        .collection(collection.PRODUCTS_COLLECTION)
        .find(filter)
        .sort(sortOption);

      if (options.limit) {
        query = query.limit(parseInt(options.limit));
      }

      products = await query.toArray();
    }

    return products; // always returns a Promise
  } catch (error) {
    console.error("❌ Error in getProducts:", error);
    throw error;
  }
};

export const productViewPage = async (req, res) => {
  console.log("✅ Product view route hit");

  try {
    const db = await connectToDatabase(process.env.DATABASE);

    // Step 1: Check if ID is received in URL
    const productId = req.query.id;
    console.log("🆔 Product ID from URL:", productId);

    if (!productId) {
      console.log("❌ No product ID provided in URL");
      return res.status(400).send("Product ID is required");
    }

    // Step 2: Validate ObjectId
    if (!ObjectId.isValid(productId)) {
      console.log("❌ Invalid ObjectId:", productId);
      return res.status(400).send("Invalid product ID");
    }

    // Step 3: Fetch product from DB
    const product = await db
      .collection(collection.PRODUCTS_COLLECTION)
      .findOne({ _id: new ObjectId(String(productId)) });

    // console.log(">>>>>>>>Product Data",product);

    if (!product) {
      console.log("❌ Product not found in database");
      return res.status(404).send("Product not found");
    }

    // Step 5: Render product view
    res.redierect("user/home", {
      title: `Product`,
    });
  } catch (error) {
    console.error("❌ Error in productViewPage:", error);
    res.status(500).send("Server error");
  }
};

export const productDeatilsPage = async (req, res) => {
  console.log("product Deatils fuction called");
  try {
    const db = await connectToDatabase(process.env.DATABASE);

    // Step 1: Check if ID is received in URL
    const productId = req.query.id;
    console.log("🆔 Product ID from URL:", productId);

    if (!productId) {
      console.log("❌ No product ID provided in URL");
      return res.status(400).send("Product ID is required");
    }

    // Step 2: Validate ObjectId
    if (!ObjectId.isValid(productId)) {
      console.log("❌ Invalid ObjectId:", productId);
      return res.status(400).send("Invalid product ID");
    }

    // Step 3: Fetch product from DB
    const product = await db
      .collection(collection.PRODUCTS_COLLECTION)
      .findOne({ _id: new ObjectId(String(productId)) });

    // console.log(">>>>>>>>Product Data",product);

    if (!product) {
      console.log("❌ Product not found in database");
      return res.status(404).send("Product not found");
    }
    console.log(product);

    const relatedProducts = await getProductsData({
      category: product.category,
      limit: 4,
    });

    console.log("relatedProducts>>>", relatedProducts);

    res.render("user/productDetails", {
      title: `Product -${product.name}`,
      product,
      relatedProducts,
    });
  } catch (error) {
    console.log(error);
  }
};
