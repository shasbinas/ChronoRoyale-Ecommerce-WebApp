import { ObjectId } from "mongodb";
import collection from "../../config/collection.js";
import connectToDatabase from "../../config/db.js";
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
