import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation instead of Zod
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "2h", // Token expiration time
    });
    res.status(200).json({ token, user: "Admin logged in sucessfully" });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


