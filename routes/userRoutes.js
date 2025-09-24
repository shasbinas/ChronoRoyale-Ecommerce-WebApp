import express from "express";
import { login, signup } from "../controllers/authController.js";

const userRoutes = express.Router({ mergeParams: true });

userRoutes.post("/signup", signup);

userRoutes.post("/login", login);

// userRoutes.post("/", );


userRoutes.get("/login", (req, res) => {
  res.status(200).json({ message: "login page route working 🚀" });
});

userRoutes.get("/", (req, res) => {
  res.status(200).json({ message: "Landing page route working 🚀" });
});

export default userRoutes;
