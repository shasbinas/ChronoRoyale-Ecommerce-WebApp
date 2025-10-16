import { ObjectId } from "mongodb";
import collection from "../config/collection.js";
import connectToDatabase from "../config/db.js";
import { getProductsData } from "./productController.js";

export const adminLoginPage = async (req, res) => {
  console.log("Admin dashboard route working 🚀");
  //   res.status(200).json({ message: "Admin dashboard route working 🚀" });

  res.render("admin/adminLogin", { layout: "admin", title: "Admin Login" });
};

export const adminDashboardPage = async (req, res) => {
  try {
    const db = await connectToDatabase(process.env.DATABASE);

    // Current month range
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const now = new Date();

    // 1️⃣ Total Delivered Orders (This Month)
    const deliveredOrdersCount = await db
      .collection(collection.ORDERS_COLLECTION)
      .countDocuments({
        status: "Delivered",
        createdAt: { $gte: startOfMonth, $lte: now },
      });

    // 2️⃣ Total Revenue from Delivered Orders (This Month)
    const revenueData = await db
      .collection(collection.ORDERS_COLLECTION)
      .aggregate([
        {
          $match: {
            status: "Delivered",
            createdAt: { $gte: startOfMonth, $lte: now },
          },
        },
        { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
      ])
      .toArray();
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // 3️⃣ Total Products Sold (This Month)
    const productData = await db
      .collection(collection.ORDERS_COLLECTION)
      .aggregate([
        {
          $match: {
            status: "Delivered",
            createdAt: { $gte: startOfMonth, $lte: now },
          },
        },
        { $unwind: "$cart" },
        {
          $group: { _id: null, totalProductsSold: { $sum: "$cart.quantity" } },
        },
      ])
      .toArray();
    const totalProductsSold = productData[0]?.totalProductsSold || 0;

    // ✅ 4️⃣ Total Registered Users (All-Time)
    const totalUsers = await db
      .collection(collection.USERS_COLLECTION) // make sure this is your actual users collection name
      .countDocuments();

    // ✅ 5️⃣ Users Who Placed Orders (All-Time)
    const activeUsersData = await db
      .collection(collection.ORDERS_COLLECTION)
      .distinct("userId");
    const usersWhoOrdered = activeUsersData.length;

    // 6️⃣ Donut Chart Data: Order Status Counts (This Month)
    const statusData = await db
      .collection(collection.ORDERS_COLLECTION)
      .aggregate([
        { $match: { createdAt: { $gte: startOfMonth, $lte: now } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray();

    const donutLabels = statusData.map((item) => item._id);
    const donutData = statusData.map((item) => item.count);

    res.render("admin/dashboard", {
      layout: "admin",
      title: "Admin Dashboard",
      totalRevenue: totalRevenue.toFixed(2),
      deliveredOrdersCount,
      totalProductsSold,
      totalUsers, // ✅ All registered users
      usersWhoOrdered, // ✅ Optional metric: customers who actually ordered
      donutLabels: JSON.stringify(donutLabels),
      donutData: JSON.stringify(donutData),
    });
  } catch (error) {
    console.error("Error loading admin dashboard:", error);
    res.status(500).send("Something went wrong loading the dashboard.");
  }
};

export const adminUsersListPage = async (req, res) => {
  // console.log("Admin UserstList route working 🚀");
  try {
    const db = await connectToDatabase(process.env.DATABASE);

    let usersData = await db
      .collection(collection.USERS_COLLECTION)
      .find({})
      .toArray();

    // format createdAt before sending to HBS
    usersData = usersData.map((user) => {
      return {
        ...user,
        createdAtFormatted: new Date(user.createdAt).toLocaleDateString(
          "en-GB"
        ), // dd/mm/yyyy
      };
    });

    // console.log("userData:", usersData);

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

export const adminAddProductPage = async (req, res) => {
  console.log("Admin AddProduct route working 🚀");
  res.render("admin/add-product", {
    layout: "admin",
    title: "Admin - Add Product",
  });
};

export const adminOrdersListPage = async (req, res) => {
  console.log("Admin OrdersList route working 🚀");
  try {
    const db = await connectToDatabase(process.env.DATABASE);

    const ordersCollection = db.collection(collection.ORDERS_COLLECTION);
    const usersCollection = db.collection(collection.USERS_COLLECTION);

    // Fetch all orders sorted by newest
    const orders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Map orders to include totals and user email
    const ordersWithTotals = await Promise.all(
      orders.map(async (order) => {
        // Calculate totals for cart items
        const cartWithTotal = order.cart.map((item) => ({
          ...item,
          total: item.total || item.price * item.quantity,
        }));
        const totalAmount = cartWithTotal.reduce(
          (acc, item) => acc + item.total,
          0
        );

        // Fetch email from users collection using string UUID
        let userEmail = "N/A";
        if (order.userId) {
          try {
            // Make sure this matches the field storing UUID in your users collection
            const user = await usersCollection.findOne({
              userId: order.userId,
            });
            if (user && user.email) userEmail = user.email;
          } catch (err) {
            console.log("Error fetching user email for order:", order._id, err);
          }
        }

        return {
          ...order,
          cart: cartWithTotal,
          totalAmount,
          userEmail, // now guaranteed to exist if user is found
        };
      })
    );

    // Render the admin orders list page
    res.render("admin/orders-list", {
      layout: "admin",
      title: "Admin - Orders List",
      orders: ordersWithTotals,
    });
  } catch (error) {
    console.error("Error loading admin orders list:", error);
    res
      .status(500)
      .send("Something went wrong while loading orders for admin.");
  }
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

/***** */
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

/**** */

export const adminProductsListPage = async (req, res) => {
  try {
    // ✅ Fetch products using the helper with latest sort
    const products = await getProductsData({ sort: "latest" });

    // ✅ Render the admin products list page
    res.render("admin/products-list", {
      layout: "admin",
      title: "Admin - Products List",
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};

/*** */
export const updateOrderStatus = async (req, res) => {
  try {
    const db = await connectToDatabase(process.env.DATABASE);
    const ordersCollection = db.collection(collection.ORDERS_COLLECTION);

    const orderId = req.params.id;
    const newStatus = req.params.status;

    console.log("🆕 Updating order:", orderId, "➡️", newStatus);

    // Update order status
    await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: newStatus, updatedAt: new Date() } }
    );

    // Redirect back to orders list
    res.redirect("/admin/orders-list");
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).send("Failed to update order status.");
  }
};

export const adminOrderDetailsPage = async (req, res) => {
  console.log("Admin Order Details route working 🚀");
  try {
    const db = await connectToDatabase(process.env.DATABASE);

    const orderId = req.params.id;
    const ordersCollection = db.collection(collection.ORDERS_COLLECTION);
    const productsCollection = db.collection(collection.PRODUCTS_COLLECTION); // ✅ corrected key

    // Fetch the order by ID
    const order = await ordersCollection.findOne({
      _id: new ObjectId(orderId),
    });
    if (!order) return res.status(404).send("Order not found");

    // Attach product details for each cart item
    const cartWithProductDetails = await Promise.all(
      order.cart.map(async (item) => {
        const product = await productsCollection.findOne({
          _id: new ObjectId(item.productId),
        });
        return {
          ...item,
          name: product?.name || "Unknown Product",
          brand: product?.brand || "Unknown Brand",
          stock: product?.stock ?? "N/A",
          image: product?.image || "/assets/imgs/shop/default.jpg",
        };
      })
    );

    // Calculate total amount
    const totalAmount = cartWithProductDetails.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Render the order details page
    res.render("admin/order-details", {
      layout: "admin",
      title: `Order Details - ${order._id}`,
      order,
      cart: cartWithProductDetails,
      totalAmount,
    });
  } catch (error) {
    console.error("Error loading admin order details:", error);
    res.status(500).send("Something went wrong loading order details.");
  }
};
