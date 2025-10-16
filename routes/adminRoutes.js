import express from "express";
import { adminLogin } from "../controllers/adminAuth.js";
import { blockUnblockUser } from "../controllers/userController.js";
import {} from "../controllers/orderController.js";
import { createProduct } from "../controllers/productController.js";
import {
  adminAddProductPage,
  adminDashboardPage,
  adminLoginPage,
  adminLogout,
  adminOrderDetailsPage,
  adminOrdersListPage,
  adminProductsListPage,
  adminUsersListPage,
  updateOrderStatus,
} from "../controllers/adminController.js";
import connectToDatabase from "../config/db.js";
import { uploadFiles } from "../middleware/uploadMiddleware.js";

const adminRoutes = express.Router({ mergeParams: true });

adminRoutes.get("/", adminLoginPage);

adminRoutes.post("/login", adminLogin);

adminRoutes.get("/logout", adminLogout);

adminRoutes.get("/dashboard", adminDashboardPage);

adminRoutes.get("/users-list", adminUsersListPage);

adminRoutes.get("/products-list", adminProductsListPage);

adminRoutes.post(
  "/add-product",
  uploadFiles("userAssets/pictures", "multiple", "productImages", 4),
  createProduct
);

adminRoutes.post("/block-user/:id", blockUnblockUser);

adminRoutes.get("/add-product", adminAddProductPage);

adminRoutes.get("/orders-list", adminOrdersListPage);

adminRoutes.get("/update-order-status/:id/:status", updateOrderStatus);

adminRoutes.get("/orders/:id", adminOrderDetailsPage);

// adminRoutes.get("/orders/:id", adminOrderDetailsPage);




export default adminRoutes;
