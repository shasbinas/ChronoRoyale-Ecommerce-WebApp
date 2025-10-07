import express from "express";
import {
  landingPage,
  loginPage,
  signupPage,
} from "../controllers/userController.js";
import { productDeatilsPage } from "../controllers/productController.js";
import { createUser, loginUser } from "../controllers/authController.js";
import { attachUser } from "../middleware/verifyToken.js";

const userRoutes = express.Router({ mergeParams: true });

userRoutes.get("/login", loginPage);

userRoutes.post("/login-user", loginUser);

userRoutes.get("/signup", signupPage);

userRoutes.post("/create-user", createUser);

// userRoutes.get("/", attachUser, landingPage);
userRoutes.get("/", landingPage);

userRoutes.get("/productDetails", productDeatilsPage);

export default userRoutes;
