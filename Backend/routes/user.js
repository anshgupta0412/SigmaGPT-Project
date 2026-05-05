import express from "express";
import user from "../models/user.js";
import passport from "passport";

const router = express.Router();

// test route
router.get("/signup", (req, res) => {
  console.log("user signup route hit");
  res.send("user successfully registered");
});

// signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new user({ username, email });
    await user.register(newUser, password);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (err) {
    console.log(err);

    if (err.name === "UserExistsError") {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
    }

    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// login route
router.get("/login", (req, res) => {
  console.log("user login route hit");
  res.send("user successfully logged In!!");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info?.message || "Invalid username or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Login failed" });
      }
      return res.status(200).json({ success: true, message: "Logged in successfully", user: { username: user.username, email: user.email } });
    });
  })(req, res, next);
});

// check auth status
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ success: true, user: { username: req.user.username, email: req.user.email } });
  }
  return res.status(401).json({ success: false, message: "Not authenticated" });
});

// logout route
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  });
});
export default router;