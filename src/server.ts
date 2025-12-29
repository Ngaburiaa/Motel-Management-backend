import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { userRouter } from "./user/user.route";
import { bookingRouter } from "./booking/booking.route";
import { hotelRouter } from "./hotel/hotel.route";
import { roomRouter } from "./room/room.route";
import { ticketRouter } from "./supportTicket/ticket.route";
import { paymentRouter } from "./payment/payment.route";
import { authRouter } from "./auth/auth.route";
import { amenityRouter } from "./amenities/amenities.route";
import { addressRouter } from "./addresses/addresses.route";
import { entityAmenityRouter } from "./entityAmenities/enityAmenities.routes";
import { wishlistRouter } from "./wishlist/wishlist.route";
import { stripeRouter } from "./stripe/stripe.routes";
import { contactRouter } from "./contact/contact.routes";
import { availabilityRouter } from "./availability/availability.route";
import { newsletterRouter } from "./newletter/newsletter.route";
import { webhookHandler } from "./stripe/stripe.webhook";
import { reviewRouter } from "./reviews/review.routes";
import { roomTypeRouter } from "./roomType/roomType.routes";
import { analyticsRouter } from "./analytics/analytics.route";
import { logger } from "./middleware/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Stripe Webhook: MUST come BEFORE express.json()
app.post(
  "/api/webhook",
  (req, res, next) => {
    res.set("Content-Encoding", "identity"); // prevent Render from compressing
    next();
  },
  express.raw({ type: "application/json" }),
  webhookHandler
);

// 🌍 CORS setup (for local & deployed frontend)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://motel-management-frontend-6i4k222tb-ngaburia.vercel.app",
      "https://motel-management-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests for all routes
app.use(cors());


// 🧾 Logging middleware
app.use(logger);

// 🔍 Body parsers (for all other routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 API Routes
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", bookingRouter);
app.use("/api", hotelRouter);
app.use("/api", roomRouter);
app.use("/api", ticketRouter);
app.use("/api", paymentRouter);
app.use("/api", amenityRouter);
app.use("/api", contactRouter);
app.use("/api", newsletterRouter);
app.use("/api", availabilityRouter);
app.use("/api", wishlistRouter);
app.use("/api", analyticsRouter);
app.use("/api", addressRouter);
app.use("/api", entityAmenityRouter);
app.use("/api", stripeRouter);
app.use("/api", reviewRouter);
app.use("/api", roomTypeRouter);

// 🌟 Root route
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Hotel Room Booking Backend is running.");
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
