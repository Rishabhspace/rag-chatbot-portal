const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const MONGO_URL = process.env.MONGO_URL;

let db;

const connectToMongo = async () => {
  if (!db) {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db("rag_chatbot");
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
  }
  return db;
};

const signup = async (email, password) => {
  const db = await connectToMongo();
  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection("users").insertOne({ email, password: hashedPassword });
};

const login = async (email, password) => {
  const db = await connectToMongo();
  const user = await db.collection("users").findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ sub: email }, SECRET_KEY, { expiresIn: "24h" });
  return token;
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ detail: "No token provided" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ detail: "Invalid or expired token" });
  }
};

module.exports = { signup, login, authMiddleware };
