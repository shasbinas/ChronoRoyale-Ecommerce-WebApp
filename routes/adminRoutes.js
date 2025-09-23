import express from "express";
import { adminLogin } from "../controllers/adminController/adminAuth.js";
import {
  getAllUsersData,
  getUsersData,
  updateUserBlockStatus,
} from "../controllers/userController/userController.js";

const adminRoutes = express.Router({ mergeParams: true });

adminRoutes.post("/login", adminLogin);

adminRoutes.get("/users", getAllUsersData);

adminRoutes.get("/users/:id", getUsersData);

adminRoutes.patch("/users/:id", updateUserBlockStatus);

// adminRoutes.get("/test",(req,res)=>{
//     res.status(200).json({ message:"Admin login rotes working"});
// })

export default adminRoutes;
