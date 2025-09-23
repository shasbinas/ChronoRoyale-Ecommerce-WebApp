import express from "express";
import { login, signup } from "../controllers/userController/authController.js";

const userRoutes = express.Router({ mergeParams: true });

userRoutes.post("/signup", signup);

userRoutes.post("/login", login);

// userRoutes.get("/test", (req, res) => {
//   res.status(200).json({ message: "Auth route working 🚀" });
// });

export default userRoutes;
