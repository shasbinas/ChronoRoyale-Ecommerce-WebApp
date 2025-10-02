import express from "express";
import { login, signup } from "../controllers/authController.js";
import { landingPage, productsPage } from "../controllers/userController.js";
import { getHomeProducts, productViewPage } from "../controllers/productController.js";

const userRoutes = express.Router({ mergeParams: true });

userRoutes.get("/", landingPage);

userRoutes.get("/products", productsPage);

userRoutes.get("/home-products", getHomeProducts);

userRoutes.get("/product-view", productViewPage);

// Render login/signup pages
userRoutes.get("/login", (req, res) => {
  res.render("user/login", { title: "Login - ChronoRoyale" });
});

userRoutes.post("/login", login);

userRoutes.get("/signup", (req, res) => {
  res.render("user/signup", { title: "Login - ChronoRoyale" });
});

userRoutes.post("/signup", signup);

export default userRoutes;
