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

export const productsList = async (req, res) => {
  try {
    // Connect to your database
    const db = await connectToDatabase(process.env.DATABASE);

    // Fetch all products from your products collection
    const products = await db
      .collection(collection.PRODUCTS_COLLECTION) // make sure this is defined in collection.js
      .find({})
      .toArray();

    // Render productsList.hbs with fetched data
    res.render("admin/productsList", {
      layout: "admin",
      title: "Admin - Products List",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    // fallback render in case of error
    res.render("admin/productsList", {
      layout: "admin",
      title: "Admin - Products List",
      products: [],
    });
  }
};




