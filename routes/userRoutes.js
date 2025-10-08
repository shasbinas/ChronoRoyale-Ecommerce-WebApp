import express from "express";
import {
  cartPage,
  landingPage,
  loginPage,
  signupPage,
} from "../controllers/userController.js";
import { productDeatilsPage } from "../controllers/productController.js";
import { createUser, loginUser, logout } from "../controllers/authController.js";
import { noCache } from "../middleware/noCache.js";
import { redirectIfLoggedIn } from "../middleware/redirectIfLoggedIn.js";




const userRoutes = express.Router({ mergeParams: true });

// Redirect logged-in users from login/signup
// Login & Signup: redirect if logged in and prevent cached pages
userRoutes.get("/login",noCache, redirectIfLoggedIn, loginPage);

userRoutes.get("/signup",noCache, redirectIfLoggedIn,  signupPage);




// Auth actions
userRoutes.post("/login-user", loginUser);
 
userRoutes.post("/create-user", createUser);//user signup

userRoutes.get("/logout", logout);

//public pages

userRoutes.get("/", landingPage);

userRoutes.get("/productDetails", productDeatilsPage);

// cartPage

userRoutes.get("/cart", cartPage)

//private page

// userRoutes.get("/profile", requireAuth, (req, res) => {
//   res.render("user/profile", {
//     title: "Your Profile",
//     loggedInUser: req.loggedInUser,
//   });
// });


export default userRoutes;
