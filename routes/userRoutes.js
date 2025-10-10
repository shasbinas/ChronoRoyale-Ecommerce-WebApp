import express from "express";
import {
  addToCart,
  cartPage,
  checkoutPage,
  clearCart,
  createAddress,
  landingPage,
  loginPage,
  orderSuccess,
  placeOrder,
  removeFromCart,
  signupPage,
} from "../controllers/userController.js";
import { productDeatilsPage } from "../controllers/productController.js";
import {
  createUser,
  loginUser,
  logout,
} from "../controllers/authController.js";
import { noCache } from "../middleware/noCache.js";
import { redirectIfLoggedIn } from "../middleware/redirectIfLoggedIn.js";
import { requireAuth } from "../middleware/requireAuth.js";

const userRoutes = express.Router({ mergeParams: true });

// Redirect logged-in users from login/signup
// Login & Signup: redirect if logged in and prevent cached pages
userRoutes.get("/login", noCache, redirectIfLoggedIn, loginPage);

userRoutes.get("/signup", noCache, redirectIfLoggedIn, signupPage);

// Auth actions
userRoutes.post("/login-user", loginUser);

userRoutes.post("/create-user", createUser); //user signup

userRoutes.get("/logout", logout);

//public pages

userRoutes.get("/", landingPage);

userRoutes.get("/productDetails", productDeatilsPage);

// cartPage

userRoutes.get("/cart", cartPage);

userRoutes.post("/add-to-cart", requireAuth, addToCart);

userRoutes.get("/cart/clear", clearCart); //clear cart

userRoutes.get("/cart/remove/:productId", removeFromCart); //remove selected product from cart

//checkout
userRoutes.get("/checkout", checkoutPage);

userRoutes.post("/create-address", createAddress);

userRoutes.post("/place-order", placeOrder);

userRoutes.get("/order-success", orderSuccess);

//private page

// userRoutes.get("/profile", requireAuth, (req, res) => {
//   res.render("user/profile", {
//     title: "Your Profile",
//     loggedInUser: req.loggedInUser,
//   });
// });

export default userRoutes;
