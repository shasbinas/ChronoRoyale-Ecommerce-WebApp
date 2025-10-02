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
  return await db
    .collection(collection.PRODUCTS_COLLECTION)
    .find({})
    .toArray();
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
    const pictures = req.files.map((file) => `/userAssets/pictures/${file.filename}`);
    console.log(pictures)

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
      .collection(collection.PRODUCT_COLLECTION)
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
      .collection(collection.PRODUCT_COLLECTION)
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

/* Get last 8 products for home page */
export const getHomeProducts = async (req, res) => {
  try {
    const db = await connectToDatabase(process.env.DATABASE);

    const products = await db
      .collection(collection.PRODUCT_COLLECTION)
      .find({})
      .sort({ createdAt: -1 }) // newest products first
      .limit(8)                 
      .toArray();

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching home products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch home products",
      error: error.message,
    });
  }
};



export const productViewPage = async (req, res) => {
  console.log("Product view page route working 🚀");
 try {

  res.render("user/product-View", { title: "Product View - ChronoRoyale" });
  
 } catch (error) {
  console.log(error);
  
 }
}