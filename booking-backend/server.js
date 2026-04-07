require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
const port = process.env.PORT || 3500;

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enhanced CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5501",
    "http://localhost:5501"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

app.use(express.static(path.join(__dirname, "../")));

app.use((req, res, next) => {
  res.locals.req = req;
  next();
});

// Database Schemas
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  eventType: String,
  date: String,
  message: String,
  package: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Booking = mongoose.model("Booking", bookingSchema);
const User = mongoose.model("User", userSchema);

// Initialize admin user
(async function () {
  try {
    const existing = await User.findOne({ username: "admin" });
    if (!existing) {
      const hashed = await bcrypt.hash("admin123", 10);
      await User.create({ username: "admin", password: hashed });
      console.log("🔐 Admin created: admin / admin123");
    }
  } catch (err) {
    console.error("Error initializing admin:", err);
  }
})();

// Authentication Middleware (EJS views)
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) return next();
  res.redirect("/admin/login");
}

// Authentication Middleware (API)
function isAuthenticatedAPI(req, res, next) {
  if (req.session.isAuthenticated) return next();
  res.status(401).json({ error: "Unauthorized" });
}
// Helper Functions
async function getBookingStats() {
  const total = await Booking.countDocuments();
  const approved = await Booking.countDocuments({ status: "Approved" });
  const pending = await Booking.countDocuments({ status: "Pending" });
  const rejected = await Booking.countDocuments({ status: "Rejected" });

  return { total, approved, pending, rejected };
}

// ============= PUBLIC ROUTES =============

// CORS Test Endpoint
app.get("/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "✅ CORS is working correctly!",
    origin: req.headers.origin
  });
});

// Submit booking from frontend
app.post("/submit-booking", async (req, res) => {
  try {
    console.log("\n📨 [/submit-booking] Request received");
    console.log("Origin:", req.headers.origin);
    console.log("Method:", req.method);
    console.log("Body:", req.body);
    
    if (!req.body.name || !req.body.email || !req.body.phone) {
      console.warn("⚠️  Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, phone"
      });
    }
    
    const booking = new Booking(req.body);
    await booking.save();
    
    console.log("✅ Booking saved successfully:");
    console.log("  ID:", booking._id);
    console.log("  Name:", booking.name);
    console.log("  Email:", booking.email);
    console.log("  Event Type:", booking.eventType);
    console.log("  Status:", booking.status);
    
    res.status(200).json({
      success: true,
      id: booking._id,
      message: "✅ Booking submitted! We'll contact you soon.",
    });
  } catch (err) {
    console.error("❌ Booking submission error:", err.message);
    res.status(500).json({
      success: false,
      message: "❌ Booking submission failed.",
      error: err.message
    });
  }
});

// ============= AUTHENTICATION ROUTES (API) =============

// Check if user is authenticated
app.get("/api/auth/check", (req, res) => {
  if (req.session.isAuthenticated) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Login endpoint (API)
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    req.session.isAuthenticated = true;
    res.json({
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Logout endpoint (API)
app.get("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// ============= BOOKINGS API ROUTES =============

// Get all bookings
app.get("/api/bookings", isAuthenticatedAPI, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Get single booking
app.get("/api/bookings/:id", isAuthenticatedAPI, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

// Create booking
app.post("/api/bookings", isAuthenticatedAPI, async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Update booking
app.put("/api/bookings/:id", isAuthenticatedAPI, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// Delete booking
app.delete("/api/bookings/:id", isAuthenticatedAPI, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

// Update booking status
app.post("/api/bookings/:id/status", isAuthenticatedAPI, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = status;
    booking.updatedAt = new Date();
    await booking.save();

    // Send SMS notification if approved
    if (status === "Approved") {
      const message = `Hi ${booking.name}, your booking has been approved! We'll contact you soon. – AR Event & Wedding Planner`;
      try {
        await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+91${booking.phone}`,
        });
        console.log("✅ SMS sent to", booking.phone);
      } catch (err) {
        console.error("❌ SMS failed:", err.message);
      }
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      booking,
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Get dashboard stats
app.get("/api/dashboard-stats", isAuthenticatedAPI, async (req, res) => {
  try {
    const stats = await getBookingStats();
    res.json(stats);
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ============= EJS VIEW ROUTES (Legacy) =============

app.get("/admin/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/admin/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  const valid = user && (await bcrypt.compare(req.body.password, user.password));
  if (!valid) return res.render("login", { error: "Invalid credentials" });
  req.session.isAuthenticated = true;
  res.redirect("/admin/dashboard");
});

app.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

app.get("/admin/dashboard", isAuthenticated, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    const stats = await getBookingStats();

    res.render("dashboard", {
      bookings,
      stats: {
        total: stats.total,
        approved: stats.approved,
        pending: stats.pending,
        rejected: stats.rejected,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).send("Error loading dashboard");
  }
});

app.get("/admin/booking/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.render("edit-booking", { booking });
  } catch (err) {
    res.status(500).send("Error loading booking");
  }
});

app.post("/admin/booking/edit/:id", isAuthenticated, async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, {
      ...req.body,
      updatedAt: new Date(),
    });
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.status(500).send("Error updating booking");
  }
});

app.post("/admin/booking/status/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("Booking not found");

    booking.status = req.body.status;
    booking.updatedAt = new Date();
    await booking.save();

    if (req.body.status === "Approved") {
      const message = `Hi ${booking.name}, your booking has been approved! We'll contact you soon. – AR Event & Wedding Planner`;
      try {
        await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+91${booking.phone}`,
        });
      } catch (err) {
        console.error("SMS error:", err.message);
      }
    }

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).send("Error updating booking status");
  }
});

app.post("/admin/booking/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.status(500).send("Error deleting booking");
  }
});

// ============= ERROR HANDLING =============

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ============= SERVER START =============

app.listen(port, () => {
  console.log(`\n🚀 Server running on http://localhost:${port}`);
  console.log(`📋 API Base: http://localhost:${port}/api`);
  console.log(`🔐 Admin Panel: http://localhost:${port}/admin/login`);
  console.log(`\n✅ CORS Configuration:`);
  console.log(`   Origins allowed:
   - http://localhost:3000
   - http://localhost:3001
   - http://127.0.0.1:3000
   - http://127.0.0.1:3001
   - http://127.0.0.1:5501 ✨ (Your Website)
   - http://localhost:5501 ✨ (Your Website)
  `);
  console.log(`📌 Test CORS: http://localhost:${port}/cors-test`);
  console.log(`📌 Submit Booking: POST http://localhost:${port}/submit-booking\n`);
});