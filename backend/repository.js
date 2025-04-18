const fs = require("fs").promises;
const path = require("path");
const { processFile, updateVectorStore } = require("./rag");

const UPLOADS_PATH = "Uploads";

const ensureUploadsPath = async () => {
  await fs.mkdir(UPLOADS_PATH, { recursive: true });
};

const storeFile = async (fileContent) => {
  try {
    await ensureUploadsPath();
    const filePath = path.join(UPLOADS_PATH, `file_${Date.now()}.bin`);
    await fs.writeFile(filePath, fileContent);

    // Process and index content for RAG
    const text = await processFile(fileContent, "pdf");
    await updateVectorStore([text]);
  } catch (error) {
    console.error("Store file error:", error);
    throw error;
  }
};

const listFolders = async () => {
  await ensureUploadsPath();
  const entries = await fs.readdir(UPLOADS_PATH, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
};

const flagGap = async (question, response) => {
  const gapPath = path.join(UPLOADS_PATH, "gaps.txt");
  const content = `Question: ${question}\nResponse: ${response}\n\n`;
  await fs.appendFile(gapPath, content);
};

module.exports = { storeFile, listFolders, flagGap };
