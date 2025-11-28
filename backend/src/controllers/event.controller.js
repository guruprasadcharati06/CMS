import Event from "../models/Event.model.js";
import Registration from "../models/Registration.model.js";

const toComparable = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

const buildCaseInsensitiveRegex = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}$`, "i");
};

const buildQueryFilters = (query, user) => {
  const filters = {};

  if (query.status) {
    if (query.status === "all") {
      // no status filter
    } else if (query.status.includes(",")) {
      const statuses = query.status.split(",").map((status) => status.trim()).filter(Boolean);
      if (statuses.length) {
        filters.status = { $in: statuses };
      }
    } else {
      filters.status = query.status;
    }
  } else {
    filters.status = { $in: ["approved", "completed"] };
  }

  if (user && user.role !== "admin") {
    const collegeRegex = buildCaseInsensitiveRegex(user.data?.college);
    if (collegeRegex) {
      filters.college = collegeRegex;
    }
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.organizer) {
    if (query.organizer === "me" && user?.id) {
      filters.organizer = user.id;
    } else {
      filters.organizer = query.organizer;
    }
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

    const organizerCollege = req.user?.data?.college;
    if (organizerCollege) {
      payload.college = organizerCollege;
    } else if (req.body.college) {
      payload.college = req.body.college;
    }

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
    const event = await Event.findById(eventId).populate("organizer", "name email college");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user && req.user.role !== "admin") {
      const userCollege = toComparable(req.user.data?.college);
      const eventCollege = toComparable(event.college);
      if (eventCollege && userCollege && eventCollege !== userCollege) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    let registrationMeta = null;
    if (req.user) {
      const myRegistration = await Registration.findOne({ event: eventId, attendee: req.user.id });
      if (myRegistration) {
        const attendeeProfile = req.user.data || {};
        registrationMeta = {
          id: myRegistration._id.toString(),
          status: myRegistration.status,
          attendee: {
            name: attendeeProfile.name || "",
            email: attendeeProfile.email || "",
            phone: attendeeProfile.phone || "",
            college: attendeeProfile.college || "",
          },
        };
      }
    }

    let registrationsForOrganizer;
    const isOrganizer = req.user?.role === "organizer" && event.organizer?._id?.toString() === req.user.id;
    const isAdmin = req.user?.role === "admin";
    if (isOrganizer || isAdmin) {
      registrationsForOrganizer = await Registration.find({ event: eventId })
        .populate("attendee", "name email phone college")
        .sort({ createdAt: -1 });
    }

    const response = {
      event,
      isRegistered: Boolean(registrationMeta),
      registration: registrationMeta,
    };

    if (registrationsForOrganizer) {
      response.registrations = registrationsForOrganizer;
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch event" });
  }
};

export const listEvents = async (req, res) => {
  try {
    const filters = buildQueryFilters(req.query, req.user);
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
