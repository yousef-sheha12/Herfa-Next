export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const ROLES = {
  CUSTOMER: "customer",
  ARTISAN: "artisan",
};

export const REQUEST_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  IN_PROGRESS: "inProgress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const URGENCY = {
  STANDARD: "standard",
  URGENT: "urgent",
};

export const SERVICE_CATEGORIES = [
  { id: 1, name: "Plumbing", icon: "Wrench" },
  { id: 2, name: "Electrical", icon: "Zap" },
  { id: 3, name: "Carpentry", icon: "Hammer" },
  { id: 4, name: "HVAC", icon: "Thermometer" },
  { id: 5, name: "Painting", icon: "Paintbrush" },
  { id: 6, name: "Cleaning", icon: "SprayCan" },
  { id: 7, name: "Gardening", icon: "Flower2" },
  { id: 8, name: "Appliance Repair", icon: "Settings" },
];

export const BOOKING_STEPS = [
  { id: 1, label: "Category" },
  { id: 2, label: "Details" },
  { id: 3, label: "Confirmation" },
];
