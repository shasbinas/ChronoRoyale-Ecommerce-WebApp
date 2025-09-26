import express from "express";
import { login, signup } from "../controllers/authController.js";
import { productsPage } from "../controllers/userController.js";


const userRoutes = express.Router({ mergeParams: true });

userRoutes.post("/signup", signup);

userRoutes.post("/login", login);

userRoutes.get("/products", productsPage);



userRoutes.get("/login", (req, res) => {
  res.render("user/login", { title: "Login - ChronoRoyale" });
});


userRoutes.get("/", (req, res) => {
    res.render("user/home", { title: "Home - ChronoRoyale" });

});

userRoutes.get("/signup", (req, res) => {
  res.render("user/signup", { title: "Login - ChronoRoyale" });
});






export default userRoutes;
