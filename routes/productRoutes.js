import express from "express";
import { createProduct } from "../controllers/productController.js";

const productRoutes = express.Router();

productRoutes.post("/create", createProduct);

export default productRoutes;
