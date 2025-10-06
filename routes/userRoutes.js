import express from "express";
import { landingPage } from "../controllers/userController.js";
import {productDeatilsPage} from "../controllers/productController.js"

const userRoutes = express.Router({ mergeParams: true });

userRoutes.get("/", landingPage);

userRoutes.get("/productDetails", productDeatilsPage);



export default userRoutes;
