import { ObjectId } from "mongodb";
import collection from "../config/collection.js";
import connectToDatabase from "../config/db.js";
import { bannerData, brandData } from "../data/index.js";
import { getProductsData } from "./productController.js";
import { createUser } from "./authController.js";

export const productsPage = async (req, res) => {
  console.log("productsPage route working 🚀");

  try {
    // Fetch 20 latest products
    const products = await getProductsData({
      sort: "latest",
      limit: 20,
    });

    // Render the products page
    res.render("user/products", {
      title: "Product's List - ChronoRoyale",
      products, // send the data to HBS template
    });
  } catch (error) {
    console.error("❌ Error loading products page:", error);
    res.status(500).send("Error loading products page");
  }
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

export const landingPage = async (req, res) => {
  console.log("User Landing route working 🚀");

  try {
    console.log("res.locals.user>>>>", res.locals);
    // Featured random products (6)
    const featuredProducts = await getProductsData({
      sort: "random",
      limit: 12,
    });

    // console.log(featuredProducts[0]);

    // Latest men’s watches (4)
    const latestMen = await getProductsData({
      category: "men",
      sort: "latest",
      limit: 10,
    });

    // Latest women’s watches (4)
    const latestWomen = await getProductsData({
      category: "women",
      sort: "latest",
      limit: 10,
    });

    const newArrivals = await getProductsData({
      sort: "latest",
      limit: 15,
    });

    // Render homepage with dynamic products
    res.render("user/home", {
      title: "Home - ChronoRoyale",
      banners: bannerData,
      brands: brandData,
      featured: featuredProducts,
      men: latestMen,
      women: latestWomen,
      newProducts: newArrivals,
    });
  } catch (error) {
    console.error("❌ Landing page error:", error);
    res.status(500).send("Error loading home page");
  }
};

export const loginPage = async (req, res) => {
  console.log("Login page route working 🚀");
  try {
    res.render("user/login", { title: "Login - ChronoRoyale" });
  } catch (error) {
    console.log(error);
  }
};

export const signupPage = async (req, res) => {
  console.log("Signup page route working 🚀");

  try {
    createUser;
    res.render("user/signup", { title: "Signup - ChronoRoyale" });
  } catch (error) {
    console.log(error);
  }
};

export const cartPage = async (req, res) => {
  try {
    const userId = req.loggedInUser?.id;
    const db = await connectToDatabase(process.env.DATABASE);

    const user = await db
      .collection(collection.USERS_COLLECTION)
      .findOne({ userId });

    const cart = user.cart || [];

    // Calculate cart totals
    const subtotal = cart.reduce((acc, item) => acc + item.total, 0);

    res.render("user/cart", {
      title: "Your Cart",
      cart,
      subtotal,
    });
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
};

//add cart
export const addToCart = async (req, res) => {
  console.log("add to cart funcion called>>>>>>>");

  console.log(req.body);
  try {
    let userId = req.loggedInUser?.id;
    console.log(">>>>>>user", userId);

    const { productId, name, brand, price, image, shortDescription, quantity } =
      req.body;

    const db = await connectToDatabase(process.env.DATABASE);
    const user = await db
      .collection(collection.USERS_COLLECTION)
      .findOne({ userId });

    const existingItem = user.cart.find((item) => item.productId === productId);

    if (existingItem) {
      // If item already exists, increase quantity and total
      await db.collection(collection.USERS_COLLECTION).updateOne(
        { userId, "cart.productId": productId },
        {
          $inc: {
            "cart.$.quantity": 1,
            "cart.$.total": parseFloat(price),
          },
        }
      );
    } else {
      // Add new item to cart
      const newItem = {
        productId,
        name,
        brand,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        image,
        total: parseFloat(price) * parseInt(quantity),
        shortDescription,
        addedAt: new Date(),
      };

      await db
        .collection(collection.USERS_COLLECTION)
        .updateOne({ userId }, { $push: { cart: newItem } });
    }

    res.redirect("/cart");
  } catch (error) {}
};

//clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.loggedInUser?.id;
    if (!userId) {
      return res.redirect("/login");
    }

    const db = await connectToDatabase(process.env.DATABASE);

    // Clear the cart array
    await db
      .collection(collection.USERS_COLLECTION)
      .updateOne({ userId }, { $set: { cart: [] } });

    res.redirect("/"); // redirect back to landing page
  } catch (error) {
    console.log("Error clearing cart:", error);
    res.status(500).send("Something went wrong while clearing the cart");
  }
};

//remove selected product from cart

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.loggedInUser?.id;
    const { productId } = req.params;

    if (!userId) {
      return res.redirect("/login");
    }

    const db = await connectToDatabase(process.env.DATABASE);

    // Remove the item from the cart array
    await db
      .collection(collection.USERS_COLLECTION)
      .updateOne({ userId }, { $pull: { cart: { productId: productId } } });

    res.redirect("/cart"); // Redirect back to landing page
  } catch (error) {
    console.log("Error removing item from cart:", error);
    res.status(500).send("Something went wrong");
  }
};

//checkout page

export const checkoutPage = async (req, res) => {
  try {
    const userId = req.loggedInUser?.id;
    if (!userId) {
      return res.redirect("/login");
    }

    const db = await connectToDatabase(process.env.DATABASE);
    const user = await db
      .collection(collection.USERS_COLLECTION)
      .findOne({ userId });

    const cart = user.cart || [];
    const addresses = user.addresses || []; // ✅ Get saved addresses

    // Calculate total
    const total = cart.reduce((acc, item) => acc + item.total, 0);

    res.render("user/checkout", {
      title: "Checkout",
      cart,
      total,
      addresses, // ✅ Pass to HBS
    });
  } catch (error) {
    console.error(error);
    res.send("Something went wrong");
  }
};

/// checkout page addresss
export const createAddress = async (req, res) => {
  console.log(">>>>>> createAddress() called");

  try {
    console.log("Form Data:", req.body);
    const userId = req.loggedInUser?.id;
    console.log("Logged In User ID:", userId);

    if (!userId) {
      console.log("❌ No userId found -> redirecting to /login");
      return res.redirect("/login");
    }

    const { billingName, address, landmark, phone } = req.body;
    console.log("Extracted Fields:", { billingName, address, landmark, phone });

    if (!billingName || !address || !phone) {
      console.log("❌ Required fields missing");
      return res.status(400).send("All required fields must be filled");
    }

    const db = await connectToDatabase(process.env.DATABASE);
    console.log("✅ Database connected");

    // ✅ IMPORTANT: Match using userId instead of _id
    const result = await db.collection(collection.USERS_COLLECTION).updateOne(
      { userId: userId },
      {
        $push: {
          addresses: {
            billingName,
            address,
            landmark: landmark || "",
            phone,
            createdAt: new Date(),
          },
        },
      }
    );

    console.log("Update Result:", {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });

    if (result.modifiedCount === 0) {
      console.log("⚠️ Address not added. Possible wrong userId match.");
      return res.status(500).send("Failed to add address");
    }

    console.log("✅ Address added successfully. Redirecting...");
    res.redirect("/checkout");
  } catch (error) {
    console.error("🔥 Error creating address:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const placeOrder = async (req, res) => {
  console.log(">>>>>>>> placeOrder() triggered");
  console.log("Form Data:", req.body);

  try {
    const userId = req.loggedInUser?.id;
    if (!userId) {
      console.log("❌ No userId found -> redirecting to /login");
      return res.redirect("/login");
    }

    const db = await connectToDatabase(process.env.DATABASE);
    console.log("✅ Database connected");

    const user = await db
      .collection(collection.USERS_COLLECTION)
      .findOne({ userId });

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).send("User not found");
    }

    const cart = user.cart || [];
    if (cart.length === 0) {
      console.log("⚠️ Cart is empty");
      return res.redirect("/cart");
    }

    let orderAddress;

    // ✅ Use existing address if selected
    if (user.addresses?.length && req.body.selectedAddress !== undefined) {
      const index = parseInt(req.body.selectedAddress);
      orderAddress = user.addresses[index];
      console.log("📦 Using saved address:", orderAddress);
    } 
    // ✅ Otherwise use new address from form
    else if (req.body.billingName && req.body.address && req.body.phone) {
      orderAddress = {
        billingName: req.body.billingName,
        address: req.body.address,
        landmark: req.body.landmark || "",
        phone: req.body.phone,
        createdAt: new Date(),
      };
      console.log("🆕 Using new address:", orderAddress);

      // ✅ Auto-add new address to user profile
      await db.collection(collection.USERS_COLLECTION).updateOne(
        { userId },
        { $push: { addresses: orderAddress } }
      );
      console.log("✅ New address saved to user profile");
    } 
    // ❌ No address found
    else {
      console.log("❌ No address data provided");
      return res.status(400).send("Address details missing");
    }

    // ✅ Create order object
    const order = {
      userId,
      cart,
      address: orderAddress,
      paymentMethod: req.body.payment_option,
      total: cart.reduce((acc, item) => acc + item.total, 0),
      status: req.body.payment_option === "COD" ? "Pending" : "Paid",
      createdAt: new Date(),
    };

    // ✅ Insert order in DB
    await db.collection(collection.ORDERS_COLLECTION).insertOne(order);
    console.log("✅ Order inserted into database");

    // ✅ Clear cart after successful order
    await db.collection(collection.USERS_COLLECTION).updateOne(
      { userId },
      { $set: { cart: [] } }
    );
    console.log("🧹 User cart cleared");

    // ✅ Redirect to success page
    res.redirect("/order-success");
  } catch (error) {
    console.error("🔥 Error placing order:", error);
    res.status(500).send("Something went wrong while placing the order.");
  }
};


export const orderSuccess = async (req, res) => {
  console.log("Order success page function called >>>>>>>>>>");
  try {
    const userId = req.loggedInUser?.id;
    if (!userId) return res.redirect("/login");

    const db = await connectToDatabase(process.env.DATABASE);

    // Fetch the last order for this user
    const lastOrder = await db
      .collection(collection.ORDERS_COLLECTION)
      .findOne({ userId }, { sort: { createdAt: -1 } });

    if (!lastOrder) {
      console.log("No order found for this user.");
      return res.redirect("/");
    }

    // Ensure each cart item has a total
    const cartWithTotal = lastOrder.cart.map(item => ({
      ...item,
      total: item.total || item.price * item.quantity,
    }));

    // Calculate total order amount
    const totalAmount = cartWithTotal.reduce((acc, item) => acc + item.total, 0);

    res.render("user/orderSuccess", {
      orderId: lastOrder._id,
      email: req.loggedInUser.email,
      billingName: lastOrder.address.billingName,
      address: lastOrder.address.address,
      landmark: lastOrder.address.landmark,
      phone: lastOrder.address.phone,
      cart: cartWithTotal,
      total: totalAmount,
    });
  } catch (error) {
    console.error("Error rendering order success page:", error);
    res.status(500).send("Something went wrong while loading the order success page.");
  }
};


export const getOrderHistory = async (req, res) => {
  console.log("Order history page function called >>>>>>>>>>");
  try {
    const userId = req.loggedInUser?.id;
    if (!userId) return res.redirect("/login");

    // Connect to database
    const db = await connectToDatabase(process.env.DATABASE);

    // Fetch all orders for this user, newest first
    const orders = await db
      .collection(collection.ORDERS_COLLECTION)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    if (!orders || orders.length === 0) {
      console.log("No orders found for this user.");
      return res.render("user/order-history", { orders: [] });
    }

    // Format orders: add cart totals and full totalAmount per order
    const formattedOrders = orders.map(order => {
      const cartWithTotal = order.cart.map(item => ({
        ...item,
        total: item.total || item.price * item.quantity,
      }));

      const totalAmount = cartWithTotal.reduce((acc, item) => acc + item.total, 0);

      return {
        ...order,
        cart: cartWithTotal,
        totalAmount,
      };
    });

    // ✅ Render the correct view inside "views/user/order-history.hbs"
    res.render("user/order-history", { orders: formattedOrders });
  } catch (error) {
    console.error("Error loading order history page:", error);
    res.status(500).send("Something went wrong while loading order history.");
  }
};



