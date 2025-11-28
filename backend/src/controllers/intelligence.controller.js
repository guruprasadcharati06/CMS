const venueCatalog = [
  {
    name: "Main Auditorium",
    capacity: 600,
    features: ["projector", "microphone", "sound system", "stage lighting"],
    location: "Block A · Level 1",
    strengths: ["Full AV support", "Tiered seating", "Green room access"],
  },
  {
    name: "Innovation Hall",
    capacity: 320,
    features: ["projector", "sound system", "recording setup"],
    location: "Innovation Center",
    strengths: ["Flexible seating", "Acoustic treatment", "Breakout pods"],
  },
  {
    name: "Lecture Theatre B",
    capacity: 180,
    features: ["projector", "microphone"],
    location: "Academic Block 2",
    strengths: ["Stepped seating", "Dual displays", "Easy campus access"],
  },
  {
    name: "Collaborative Studio",
    capacity: 120,
    features: ["projector", "whiteboards", "conference audio"],
    location: "Learning Commons",
    strengths: ["Modular furniture", "Workshop-ready", "Natural light"],
  },
  {
    name: "Outdoor Amphitheatre",
    capacity: 400,
    features: ["sound system", "stage lighting"],
    location: "Central Courtyard",
    strengths: ["Open-air ambience", "360° visibility", "Great for performances"],
  },
];

const normaliseText = (value = "") => value.toLowerCase().replace(/[^a-z0-9\s,]/g, " ").trim();

const extractKeywords = (text = "") => {
  if (!text) return [];
  return normaliseText(text)
    .split(/[,\s]+/)
    .map((word) => word.trim())
    .filter(Boolean);
};

const buildRationale = ({
  venue,
  expectedAttendance,
  matchedFeatures,
  equipmentNeeds,
  historicalNotes,
}) => {
  const capacityLine = `${venue.name} seats up to ${venue.capacity} guests, which comfortably accommodates your expected turnout of ${expectedAttendance}.`;
  const featureLine = matchedFeatures.length
    ? `It already includes ${matchedFeatures.join(", ")}, matching the equipment you requested${equipmentNeeds ? ` (${equipmentNeeds})` : ""}.`
    : `It offers core AV infrastructure and can support additional rentals if required${equipmentNeeds ? ` (${equipmentNeeds})` : ""}.`;
  const historyLine = historicalNotes
    ? `Considering your note — “${historicalNotes}” — this space provides a noticeable upgrade in breathing room and facilities.`
    : "";

  return [capacityLine, featureLine, historyLine].filter(Boolean).join(" ");
};

export const recommendVenue = (req, res) => {
  const { expectedAttendance, equipmentNeeds = "", historicalNotes = "" } = req.body || {};

  const attendance = Number(expectedAttendance);
  if (!Number.isFinite(attendance) || attendance <= 0) {
    return res.status(400).json({ message: "Expected attendance must be a positive number." });
  }

  const keywords = extractKeywords(equipmentNeeds);

  const candidates = venueCatalog.map((venue) => {
    const capacityGap = venue.capacity - attendance;
    const meetsCapacity = capacityGap >= 0;
    const matchedFeatures = keywords.filter((keyword) => venue.features.includes(keyword));
    const missingFeatures = keywords.filter((keyword) => !venue.features.includes(keyword));

    const score = (meetsCapacity ? capacityGap : Math.abs(capacityGap) + 500) + missingFeatures.length * 80;

    return {
      venue,
      capacityGap,
      meetsCapacity,
      matchedFeatures,
      missingFeatures,
      score,
    };
  });

  candidates.sort((a, b) => a.score - b.score);

  const recommended = candidates[0];
  const alternatives = candidates.slice(1, 4);

  const confidence = recommended.capacityGap < attendance * 0.15 ? "high" : recommended.capacityGap < attendance * 0.35 ? "medium" : "exploratory";

  const response = {
    recommendation: {
      venue: recommended.venue,
      rationale: buildRationale({
        venue: recommended.venue,
        expectedAttendance: attendance,
        matchedFeatures: recommended.matchedFeatures,
        equipmentNeeds,
        historicalNotes,
      }),
      checklist: [
        recommended.missingFeatures.length
          ? `Arrange rentals for: ${recommended.missingFeatures.join(", ")}.`
          : "Existing AV setup covers the requested equipment.",
        `Plan seating for approximately ${attendance} participants with ${Math.max(recommended.venue.capacity - attendance, 0)} spare seats for VIPs or last-minute attendees.`,
        `Confirm availability of ${recommended.venue.location} and schedule setup access at least 2 hours prior.`,
      ],
      confidence,
    },
    alternatives: alternatives.map((alt) => ({
      venue: alt.venue,
      reason: alt.meetsCapacity
        ? `Works for ${attendance} attendees with ${alt.capacityGap} seats to spare${alt.matchedFeatures.length ? ", offers " + alt.matchedFeatures.join(", ") : ""}.`
        : `Would require limiting attendees by ${Math.abs(alt.capacityGap)} or arranging overflow seating.`,
    })),
    metadata: {
      expectedAttendance: attendance,
      requestedEquipment: keywords,
    },
  };

  return res.status(200).json(response);
};
