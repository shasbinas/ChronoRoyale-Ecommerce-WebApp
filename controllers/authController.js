import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import collection from "../config/collection.js";
import connectToDatabase from "../config/db.js";
import { v7 as uuidv7 } from "uuid";

export const signup = async (req, res) => {
  console.log("signup>>>>>>>>>");
  console.log(req.body);
  try {
    const { name, email, password } = req.body;

    // Simple validation instead of Zod
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }

    const db = await connectToDatabase(process.env.DATABASE);
    const user = await db
      .collection(collection.USERS_COLLECTION)
      .findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = uuidv7();
    const userData = {
      userId,
      name,
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
    const result = await db
      .collection(collection.USERS_COLLECTION)
      .insertOne(userData);
      console.log(result);

    res.status(201).json({ message: "User created successfully",result });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation instead of Zod
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const db = await connectToDatabase(process.env.DATABASE);
    const user = await db
      .collection(collection.USERS_COLLECTION)
      .findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "2h", // Token expiration time
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
