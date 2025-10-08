import { ObjectId } from "mongodb";
import collection from "../config/collection.js";
import connectToDatabase from "../config/db.js";
import { bannerData, brandData } from "../data/index.js";
import { getProductsData } from "./productController.js";

export const productsPage = async (req, res) => {
  console.log("productsPage page route working 🚀");

  res.render("user/products", { title: "Product's List - ChronoRoyale" });
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
  res.render("user/signup", { title: "Signup - ChronoRoyale" });
};

export const cartPage = async (req, res) => {
  try {
    const userId = req.loggedInUser?.id;
    const db = await connectToDatabase(process.env.DATABASE);

    const user = await db.collection(collection.USERS_COLLECTION).findOne({ userId });

    const cart = user.cart || [];

    // Calculate cart totals
    const subtotal = cart.reduce((acc, item) => acc + item.total, 0);

    res.render("user/cart", { 
      title: "Your Cart",
      cart,
      subtotal
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
    let userId =  req.loggedInUser?.id
    console.log(">>>>>>user",userId);

   const { productId, name, brand, price, image, shortDescription, quantity } = req.body;

    const db = await connectToDatabase(process.env.DATABASE);
    const user = await db.collection(collection.USERS_COLLECTION).findOne({ userId });

    const existingItem = user.cart.find(item => item.productId === productId);

    if (existingItem) {
      // If item already exists, increase quantity and total
      await db.collection(collection.USERS_COLLECTION).updateOne(
        { userId, "cart.productId": productId },
        {
          $inc: {
            "cart.$.quantity": 1,
            "cart.$.total": parseFloat(price)
          }
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
        addedAt: new Date()
      };

      await db.collection(collection.USERS_COLLECTION).updateOne(
        { userId },
        { $push: { cart: newItem } }
      );
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
    await db.collection(collection.USERS_COLLECTION).updateOne(
      { userId },
      { $set: { cart: [] } }
    );

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
    await db.collection(collection.USERS_COLLECTION).updateOne(
      { userId },
      { $pull: { cart: { productId: productId } } }
    );

    res.redirect("/cart"); // Redirect back to landing page
  } catch (error) {
    console.log("Error removing item from cart:", error);
    res.status(500).send("Something went wrong");
  }
};