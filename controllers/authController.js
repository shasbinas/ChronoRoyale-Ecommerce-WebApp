import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import collection from "../config/collection.js";
import connectToDatabase from "../config/db.js";
import { v7 as uuidv7 } from "uuid";

/* user signup */
export const createUser = async (req, res) => {
  try {
    const { username, email, password, checkbox } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send("Name, email and password are required.");
    }

    if (!checkbox) {
      return res.status(400).send("You must agree to terms & policy.");
    }

    const db = await connectToDatabase(process.env.DATABASE);
    const existingUser = await db.collection(collection.USERS_COLLECTION).findOne({ email });

    if (existingUser) {
      return res.status(400).send("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = uuidv7();

    const userData = {
      userId,
      name: username,
      email,
      password: passwordHash,
      phone: "",
      avatar: "",
      addresses: [],
      orders: [],
      wishlist: [],
      cart: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      isBlocked: false,
    };

    await db.collection(collection.USERS_COLLECTION).insertOne(userData);

    res.redirect("/login"); // Redirect after signup
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).send("Internal server error");
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res
        .status(400)
        .render("login", { error: "Email and password are required." });
    }

    const db = await connectToDatabase(process.env.DATABASE);
    const user = await db
      .collection(collection.USERS_COLLECTION)
      .findOne({ email });

    if (!user) {
      return res
        .status(400)
        .render("login", { error: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .render("login", { error: "Invalid credentials." });
    }

    // Generate token
    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Optional: store token in a cookie for session
    res.cookie("token", token, { httpOnly: true });

    // Redirect to landing page
    res.redirect("/"); // change "/" to your landing page route
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).render("login", { error: "Internal server error" });
  }
};
