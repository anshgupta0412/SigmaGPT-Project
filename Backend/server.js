import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import PassportLocal from "passport-local";
import user from "./models/user.js";
import userRoute from "./routes/user.js";

const LocalStrategy = PassportLocal.Strategy;

dotenv.config();

const app = express();
const PORT = 8080;

// -------------------- Middleware --------------------
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser("secretcode"));

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}
app.use(session(sessionOptions));
app.use(flash());

// trying using flash package
app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  req.flash("success", "User registered successfully");
  res.send("User registered successfully");
});

// -------------------- Passport --------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// -------------------- Cookie Routes --------------------
app.get("/getcookies", (req, res) => {
  res.send("Cookies sent successfully");
});

app.get("/readcookies", (req, res) => {
  console.log(req.cookies);
  res.json(req.cookies);
});

app.get("/greet", (req, res) => {
  res.cookie("MadeIn", "India", { signed: true });
  res.send("Signed cookie sent successfully");
});

app.get("/verify", (req, res) => {
  console.log(req.signedCookies);
  res.send("Signed cookie verified");
});

app.get("/test", (req, res) => {
  res.send("Test successful");
});

// -------------------- Routes --------------------
app.use("/api", chatRoutes);
app.use("/", userRoute);

// -------------------- DB Connection --------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Successfully connected with DB");
  } catch (err) {
    console.log("Failed to connect DB:", err);
  }
};

// -------------------- Server --------------------
app.listen(PORT, async () => {
  console.log(`Listening on PORT: ${PORT}`);
  await connectDB();
});