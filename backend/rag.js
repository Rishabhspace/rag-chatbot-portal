const pdf = require("pdf-parse");
const { OpenAI } = require("openai");

let embeddingModel;

(async () => {
  const { pipeline } = await import("@xenova/transformers");
  embeddingModel = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
})();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const processFile = async (fileContent, fileType) => {
  try {
    if (fileType === "pdf") {
      const pdfData = await pdf(fileContent);
      return pdfData.text;
    }
    return fileContent.toString("utf-8");
  } catch (error) {
    console.error("Process file error:", error);
    throw new Error("Failed to process file");
  }
};

const updateVectorStore = async (texts) => {
  try {
    if (!embeddingModel) {
      throw new Error("Embedding model not initialized");
    }
    const embeddings = [];
    for (const text of texts) {
      const embedding = await embeddingModel(text, {
        pooling: "mean",
        normalize: true,
      });
      embeddings.push(Array.from(embedding.data));
    }
    console.log("Embeddings generated:", embeddings);
    return embeddings;
  } catch (error) {
    console.error("Update vector store error:", error);
    throw new Error("Failed to update vector store: " + error.message);
  }
};

const processQuery = async (question) => {
  try {
    const response = await client.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: question },
      ],
    });
    return {
      response: response.choices[0].message.content,
      confidence: 0.9,
    };
  } catch (error) {
    console.error("Query error:", error);
    throw new Error("Failed to process query: " + error.message);
  }
};

module.exports = { processFile, updateVectorStore, processQuery };
