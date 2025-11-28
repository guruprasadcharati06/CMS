import crypto from "crypto";
import Event from "../models/Event.model.js";
import Registration from "../models/Registration.model.js";
import Notification from "../models/Notification.model.js";

const generateCheckInCode = () => crypto.randomBytes(4).toString("hex");

const notify = async ({ recipient, title, message, event, type = "info", meta = {} }) => {
  try {
    if (!recipient) return;
    await Notification.create({ recipient, title, message, event, type, meta });
  } catch (error) {
    console.error("Failed to create notification", error.message);
  }
};

export const registerForEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "approved" && req.user.role !== "admin" && event.organizer.toString() !== userId) {
      return res.status(403).json({ message: "Event is not open for registration" });
    }

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ message: "Event capacity reached" });
    }

    const registration = await Registration.create({
      event: eventId,
      attendee: userId,
      status: "confirmed",
      checkInCode: generateCheckInCode(),
    });

    const populatedRegistration = await registration.populate([
      { path: "event", select: "title startDate venue organizer registeredCount capacity" },
      { path: "attendee", select: "name email phone college" },
    ]);

    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

    await notify({
      recipient: userId,
      title: "Registration confirmed",
      message: `You are registered for ${event.title}`,
      event: eventId,
      type: "info",
    });

    await notify({
      recipient: event.organizer,
      title: "New registration",
      message: `${req.user.data?.name || "A participant"} registered for ${event.title}`,
      event: eventId,
      type: "update",
    });

    return res.status(201).json({ registration: populatedRegistration });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Already registered" });
    }
    return res.status(500).json({ message: "Failed to register for event" });
  }
};

export const cancelRegistration = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    const registration = await Registration.findOne({ event: eventId, attendee: userId });
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (registration.status === "cancelled") {
      return res.status(200).json({ registration });
    }

    const countedStatuses = ["confirmed", "checked_in"];
    const shouldDecrement = countedStatuses.includes(registration.status);

    registration.status = "cancelled";
    await registration.save();

    if (shouldDecrement) {
      await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });
    }

    await notify({
      recipient: registration.attendee,
      title: "Registration cancelled",
      message: "Your registration has been cancelled",
      event: eventId,
      type: "alert",
    });

    const populatedRegistration = await registration.populate([
      { path: "event", select: "title startDate venue organizer registeredCount capacity" },
      { path: "attendee", select: "name email phone college" },
    ]);

    return res.status(200).json({ registration: populatedRegistration });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel registration" });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ attendee: req.user.id })
      .populate({ path: "event", populate: { path: "organizer", select: "name email" } })
      .sort({ createdAt: -1 });

    return res.status(200).json({ registrations });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch registrations" });
  }
};

export const getRegistrationsForEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user.role !== "admin" && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate("attendee", "name email phone college department")
      .sort({ createdAt: -1 });

    return res.status(200).json({ registrations });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch event registrations" });
  }
};

export const checkInAttendee = async (req, res) => {
  const { registrationId } = req.params;

  try {
    const registration = await Registration.findById(registrationId).populate("event");
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (req.user.role !== "admin" && registration.event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    registration.status = "checked_in";
    registration.checkedInAt = new Date();
    await registration.save();

    await notify({
      recipient: registration.attendee,
      title: "Check-in successful",
      message: `You have checked in for ${registration.event.title}`,
      event: registration.event._id,
      type: "info",
    });

    return res.status(200).json({ registration });
  } catch (error) {
    return res.status(500).json({ message: "Failed to check in attendee" });
  }
};

export const submitFeedback = async (req, res) => {
  const { registrationId } = req.params;
  const { feedback, rating } = req.body;

  try {
    const registration = await Registration.findById(registrationId).populate("event");
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (registration.attendee.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (registration.status !== "checked_in" && registration.status !== "confirmed") {
      return res.status(400).json({ message: "Feedback allowed after attending the event" });
    }

    registration.feedback = feedback;
    registration.rating = rating;
    registration.feedbackSubmitted = true;
    await registration.save();

    await notify({
      recipient: registration.event.organizer,
      title: "New feedback received",
      message: `${req.user.data?.name || "A participant"} left feedback on ${registration.event.title}`,
      event: registration.event._id,
      type: "update",
      meta: { rating: String(rating || "") },
    });

    return res.status(200).json({ registration });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit feedback" });
  }
};
