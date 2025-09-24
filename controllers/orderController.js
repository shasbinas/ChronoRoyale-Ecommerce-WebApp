import { ObjectId } from "mongodb";
import collection from "../config/collection.js";
import connectToDatabase from "../config/db.js";

/* Create new order */
export const createOrder = async (req, res) => {
  try {
    const db = await connectToDatabase(process.env.DATABASE);

    const { userId, products, totalAmount, status } = req.body;

    const newOrder = {
      _id: new ObjectId(),
      userId: new ObjectId(String(userId)),
      products,
      totalAmount,
      status: status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into collection
    const result = await db
      .collection(collection.ORDER_COLLECTION)
      .insertOne(newOrder);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result.ops ? result.ops[0] : newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const db = await connectToDatabase(process.env.DATABASE);
    const orders = await db
      .collection(collection.ORDER_COLLECTION)
      .find({})
      .toArray();
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch orders" });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase(process.env.DATABASE);
    const order = await db
      .collection(collection.ORDER_COLLECTION)
      .findOne({ _id: new ObjectId(String(id)) });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch order" });
  }
};

// Updateorderstatus
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "cancelled",
      "shipped",
      "delivered",
      "Confirmed",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatus.join(", ")}`,
      });
    }

    const db = await connectToDatabase(process.env.DATABASE);
    const result = await db
      .collection(collection.ORDER_COLLECTION)
      .updateOne({ _id: new ObjectId(String(id)) }, { $set: { status } });

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Order status updated", status });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update order status" });
  }
};
