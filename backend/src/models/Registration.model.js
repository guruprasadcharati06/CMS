import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    attendee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "checked_in", "cancelled"],
      default: "confirmed",
    },
    checkInCode: {
      type: String,
      trim: true,
    },
    checkedInAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["none", "pending", "paid", "refunded"],
      default: "none",
    },
    feedbackSubmitted: {
      type: Boolean,
      default: false,
    },
    feedback: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

registrationSchema.index({ event: 1, attendee: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;
