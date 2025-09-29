import express from "express";
import { adminLogin } from "../controllers/adminAuth.js";
import {
  blockUnblockUser,
  getAllUsersData,
  getUsersData,
  updateUserBlockStatus,
} from "../controllers/userController.js";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import {
  adminAddProductPage,
  adminDashboardPage,
  adminLoginPage,
  adminLogout,
  adminOrdersListPage,
  adminOrderViewPage,
  adminProductsListPage,
  adminUsersListPage,

} from "../controllers/adminController.js";

const adminRoutes = express.Router({ mergeParams: true });

adminRoutes.get("/", adminLoginPage);

adminRoutes.post("/login", adminLogin);

adminRoutes.get("/logout", adminLogout);

adminRoutes.get("/dashboard", adminDashboardPage);

adminRoutes.get("/users-list", adminUsersListPage); ///modified

adminRoutes.get("/products-list", adminProductsListPage);





adminRoutes.post("/block-user/:id", blockUnblockUser);

adminRoutes.get("/add-product", adminAddProductPage);

adminRoutes.get("/orders-list", adminOrdersListPage);

adminRoutes.get("/order-view", adminOrderViewPage);

adminRoutes.get("/users", getAllUsersData);

adminRoutes.get("/users/:id", getUsersData);

adminRoutes.patch("/users/:id", updateUserBlockStatus);




adminRoutes.get("/products", getAllProducts);

adminRoutes.get("/:id", getProductById);

adminRoutes.delete("/:id", deleteProduct);

adminRoutes.patch("/:id", updateProduct);

adminRoutes.get("/orders", getAllOrders);

adminRoutes.get("/orders/:id", getOrderById);

adminRoutes.patch("/orders/:id/status", updateOrderStatus);

// adminRoutes.get("/test",(req,res)=>{
//     res.status(200).json({ message:"Admin login rotes working"});
// })

export default adminRoutes;
