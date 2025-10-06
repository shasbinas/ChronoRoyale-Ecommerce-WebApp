import express from "express";
import {
  createProduct,



 
} from "../controllers/productController.js";

const productRoutes = express.Router();

productRoutes.post("/create", createProduct);

// productRoutes.get("/", getAllProducts);

// productRoutes.get("/:id", getProductById);




export default productRoutes;
