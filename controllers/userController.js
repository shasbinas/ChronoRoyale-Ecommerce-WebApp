import { ObjectId } from "mongodb";
import collection from "../config/collection.js";
import connectToDatabase from "../config/db.js";
import { bannerData, brandData } from "../data/index.js";
/* get all user data */
export const getAllUsersData = async (req, res) => {
  console.log("this api called>>>>>>");
  try {
    const db = await connectToDatabase(process.env.DATABASE);
    const allUsersData = await db
      .collection(collection.USERS_COLLECTION)
      .find({})
      .toArray();
    console.log(allUsersData);
    return res.status(200).json({
      success: true,
      data: allUsersData,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const getUsersData = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectToDatabase(process.env.DATABASE);
    const userData = await db
      .collection(collecion.USERS_COLLECTION)
      .find({ _id: new ObjectId(String(id)) })
      .toArray();

    if (!userData) {
      return res.status(400).json({ message: "User does not exist." });
    }
    console.log(userData);

    const { password: _, ...userDataWithoutPassword } = userData;

    return res.status(200).json({
      success: true,
      data: userDataWithoutPassword,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user Details",
      error: error.message,
    });
  }
};

export const updateUserBlockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { block } = req.query; // query parameter ?block=true / ?block=false

    if (block !== "true" && block !== "false") {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameter.",
      });
    }

    const db = await connectToDatabase(process.env.DATABASE);

    const result = await db
      .collection(collection.USERS_COLLECTION)
      .updateOne(
        { _id: new ObjectId(String(id)) },
        { $set: { isBlocked: block === "true" } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User ${
        block === "true" ? "blocked" : "unblocked"
      } successfully`,
    });
  } catch (error) {
    console.error("Error updating user block status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user block status",
      error: error.message,
    });
  }
};

export const productsPage = async (req, res) => {
  console.log("productsPage page route working 🚀");

  res.render("user/products", { title: "Product's List - ChronoRoyale" });
};
/****** */

export const blockUnblockUser = async (req, res) => {
  console.log("Block/Unblock User route working 🚀");

  console.log(req.params.id);
  console.log(req.query.status);
  try {
    const db = await connectToDatabase(process.env.DATABASE);
    const userId = req.params.id; // user id from params
    const { status } = req.query; // status from query true/false

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const isBlock = status === "true"; // convert query string to boolean

    // Prepare update data (no blockedAt)
    const updateData = {
      isBlocked: isBlock,
      isActive: !isBlock,
      updatedAt: new Date(),
    };

    const result = await db.collection(collection.USERS_COLLECTION).updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // res.status(200).json({
    //   message: isBlock ? "User blocked successfully" : "User unblocked successfully",
    // });

    res.redirect("/admin/users-list");
  } catch (error) {
    console.error("Block/Unblock User Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const landingPage = async (req, res) => {
  console.log("User Landing route working 🚀");

  res.render("user/home", {
    title: "Home - ChronoRoyale",
    banners: bannerData,
    brands: brandData
  });
};


