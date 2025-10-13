import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      default: 100,
      min: 1,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    bannerUrl: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    requiresApproval: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ tags: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ organizer: 1, status: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
