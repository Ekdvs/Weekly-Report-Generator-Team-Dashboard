import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();
import prisma from "./config/prisma.js";



const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();

    console.log("✅ Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database.");
    console.error(error);
    process.exit(1);
  }
}

startServer();
