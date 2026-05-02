import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

// Fixed: mounted chatRoutes so /api/thread and other routes are accessible
app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
  connectDB();
});

const connectDB = async() => {
  try{
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Successfully connected with DB");
  } catch(err) {
    console.log("failed to connect DB", err);
  }
};

// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "user",
//           content: "Hello",
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//     const data = await response.json();

//     console.log(data);
//     res.send(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error");
//   }
// });