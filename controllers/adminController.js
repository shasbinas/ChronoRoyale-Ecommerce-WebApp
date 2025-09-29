import collection from "../config/collection.js";
import connectToDatabase from "../config/db.js";

export const adminLoginPage = async (req, res) => {
  console.log("Admin dashboard route working 🚀");
  //   res.status(200).json({ message: "Admin dashboard route working 🚀" });

  res.render("admin/adminLogin", { layout: "admin", title: "Admin Login" });
};

export const adminDashboardPage = async (req, res) => {
  console.log("Admin dashboard route working 🚀");
  //   res.status(200).json({ message: "Admin dashboard route working 🚀" });

  res.render("admin/dashboard", { layout: "admin", title: "Admin Dashboard" });
};

export const adminUsersListPage = async (req, res) => {
  // console.log("Admin UserstList route working 🚀");
  try {
    const db = await connectToDatabase(process.env.DATABASE);

    const usersData = await db
      .collection(collection.USERS_COLLECTION)
      .find({})
      .toArray();
    // console.log("userData:", userData);

    res.render("admin/users-list", {
      layout: "admin",
      title: "Admin - Users List",
      usersData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.render("admin/users-list", {
      layout: "admin",
      title: "Admin - Users List",
      usersData: [],
    });
  }
};

// // Admin logout
// export const adminLogout = (req, res) => {
//   if (req.session) {
//     req.session.destroy(err => {
//       if (err) {
//         console.log("Error destroying session:", err);
//         return res.redirect("/admin/dashboard"); // fallback
//       }
//       res.clearCookie("connect.sid"); // optional: clear session cookie
//       res.redirect("/admin");          // redirect to login page
//     });
//   } else {
//     res.redirect("/admin"); // if no session exists
//   }
// };

export const adminProductsListPage = async (req, res) => {
  console.log("Admin ProductsList route working 🚀");
  res.render("admin/products-list", {
    layout: "admin",
    title: "Admin - Products List",
  });
};

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

    const result = await db
      .collection(collection.USERS_COLLECTION)
      .updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

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

export const adminAddProductPage = async (req, res) => {
  console.log("Admin AddProduct route working 🚀");
  res.render("admin/add-product", {
    layout: "admin",
    title: "Admin - Add Product",
  });
};

export const adminOrdersListPage = async (req, res) => {
  console.log("Admin OrdersList route working 🚀");
  res.render("admin/orders-list", {
    layout: "admin",
    title: "Admin - Orders List",
  });
};

export const adminOrderViewPage = async (req, res) => {
  console.log("Admin OrderView route working 🚀");
  res.render("admin/order-view", {
    layout: "admin",
    title: "Admin - Order View",
  });
};

export const adminLogout = (req, res) => {
  try {
    // Clear the token cookie on logout
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // Redirect back to login page
    return res.redirect("/admin");
  } catch (err) {
    console.error("Logout Error:", err.message);
    return res.redirect("/admin");
  }
};
