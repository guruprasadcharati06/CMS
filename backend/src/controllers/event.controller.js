import Event from "../models/Event.model.js";

const buildQueryFilters = (query) => {
  const filters = {};

  if (query.status) {
    filters.status = query.status;
  } else {
    filters.status = { $in: ["approved", "completed"] };
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.organizer) {
    filters.organizer = query.organizer;
  }

  if (query.isFeatured) {
    filters.isFeatured = query.isFeatured === "true";
  }

  if (query.search) {
    filters.$text = { $search: query.search };
  }

  if (query.startDate || query.endDate) {
    filters.startDate = {};
    if (query.startDate) {
      filters.startDate.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      filters.startDate.$lte = new Date(query.endDate);
    }
  }

  return filters;
};

export const createEvent = async (req, res) => {
  try {
    const requiredFields = ["title", "description", "startDate", "endDate", "venue"];
    const missing = requiredFields.filter((field) => !req.body[field]);

    if (missing.length) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const payload = {
      ...req.body,
      organizer: req.user.id,
      status: req.user.role === "admin" ? "approved" : "pending",
    };

    const event = await Event.create(payload);
    return res.status(201).json({ event });
  } catch (error) {
    console.error("Failed to create event", error.message);
    return res.status(500).json({ message: "Failed to create event" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = { ...req.body };

    if (req.user.role !== "admin") {
      updates.status = "pending";
    }

    const filter = { _id: eventId };
    if (req.user.role !== "admin") {
      filter.organizer = req.user.id;
    }

    const event = await Event.findOneAndUpdate(filter, updates, { new: true });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ event });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update event" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const filter = { _id: eventId };
    if (req.user.role !== "admin") {
      filter.organizer = req.user.id;
    }
    const event = await Event.findOneAndDelete(filter);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete event" });
  }
};

export const approveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndUpdate(
      eventId,
      { status: "approved" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ event });
  } catch (error) {
    return res.status(500).json({ message: "Failed to approve event" });
  }
};

export const rejectEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndUpdate(
      eventId,
      { status: "rejected" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ event });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reject event" });
  }
};

export const getEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate("organizer", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ event });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch event" });
  }
};

export const listEvents = async (req, res) => {
  try {
    const filters = buildQueryFilters(req.query);
    const sort = req.query.sort || "startDate";
    const order = req.query.order === "desc" ? -1 : 1;

    const events = await Event.find(filters)
      .populate("organizer", "name email")
      .sort({ [sort]: order });

    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({ message: "Failed to list events" });
  }
};

export const featureEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndUpdate(
      eventId,
      { isFeatured: true },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ event });
  } catch (error) {
    return res.status(500).json({ message: "Failed to feature event" });
  }
};

export const cancelEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndUpdate(
      eventId,
      { status: "cancelled" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ event });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel event" });
  }
};
