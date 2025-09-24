import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const productRoutes = express.Router();

productRoutes.post("/create", createProduct);

productRoutes.get("/", getAllProducts);

productRoutes.get("/:id", getProductById);

productRoutes.patch("/:id", updateProduct);

productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
