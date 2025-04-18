const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { authMiddleware, signup, login } = require("./auth");
const { processQuery } = require("./rag");
const { storeFile, listFolders, flagGap } = require("./repository");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    await signup(email, password);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ detail: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ detail: error.message });
  }
});

app.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: "No file provided" });
    }
    await storeFile(req.file.buffer);
    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ detail: "Upload failed: " + error.message });
  }
});

app.post("/query", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;
    const { response, confidence } = await processQuery(question);
    if (confidence < 0.7) {
      await flagGap(question, response);
    }
    res.json({ response, confidence });
  } catch (error) {
    console.error("Query endpoint error:", error);
    res.status(500).json({ detail: error.message || "Query failed" });
  }
});

app.get("/folders", authMiddleware, async (req, res) => {
  try {
    const folders = await listFolders();
    res.json(folders);
  } catch (error) {
    console.error("Folders endpoint error:", error);
    res
      .status(500)
      .json({ detail: error.message || "Failed to fetch folders" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
