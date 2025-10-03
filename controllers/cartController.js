import { ObjectId } from "mongodb";
import connectToDatabase from "../config/db.js";
/* ---------------- Render Cart Page ---------------- */
export const getCartPage = async (req, res) => {
  try {
    // Ensure cart exists
    if (!req.session) req.session = {};
    if (!req.session.cart) req.session.cart = [];

    const db = await connectToDatabase(process.env.DATABASE);

    const cartProductIds = req.session.cart.map(item => new ObjectId(item.productId));
    let cartItems = [];

    if (cartProductIds.length > 0) {
      const products = await db
        .collection(collection.PRODUCTS_COLLECTION)
        .find({ _id: { $in: cartProductIds } })
        .toArray();

      cartItems = products.map(product => {
        const cartItem = req.session.cart.find(i => i.productId === String(product._id));
        return {
          ...product,
          quantity: cartItem.quantity,
          subtotal: product.price * cartItem.quantity
        };
      });
    }

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.render("user/cart", {
      title: "Your Cart",
      cart: cartItems,
      cartSubtotal: total
    });
  } catch (error) {
    console.error("❌ Error loading cart:", error);
    res.status(500).send("Server error while loading cart");
  }
};

/* ---------------- Add Product to Cart ---------------- */
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    if (!req.session.cart) req.session.cart = [];

    const existingItem = req.session.cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      req.session.cart.push({ productId, quantity: 1 });
    }

    return res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    return res.status(500).json({ success: false, message: "Failed to add to cart" });
  }
};

/* ---------------- Remove Product from Cart ---------------- */
export const removeFromCart = (req, res) => {
  try {
    const { productId } = req.body;

    if (!req.session.cart) req.session.cart = [];

    req.session.cart = req.session.cart.filter(item => item.productId !== productId);

    return res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.error("❌ Error removing cart item:", error);
    return res.status(500).json({ success: false, message: "Failed to remove item" });
  }
};

