import jwt from "jsonwebtoken";
import connectToDatabase from "../config/db.js";
import collection from "../config/collection.js";

export const attachUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log("aattch user cooke token console>>>>>",token);
    if (!token) {
      res.locals.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await connectToDatabase(process.env.DATABASE);
    const user = await db
      .collection(collection.USERS_COLLECTION)
      .findOne({ userId: decoded.id });

    if (!user || user.isBlocked) {
      res.locals.user = null;
      return next();
    }

    res.locals.user = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    next();
  } catch (err) {
    console.error("attachUser middleware error:", err.message);
    res.locals.user = null;
    next();
  }
};
