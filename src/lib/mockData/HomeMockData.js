import {
  ShieldCheck,
  Wallet,
  BadgeCheck,
  Wrench,
  Hammer,
  Zap,
  Ellipsis,
} from "lucide-react";

export const categories = [
  { label: "Plumbing", icon: Wrench, service: "Plumbing" },
  { label: "Carpentry", icon: Hammer, service: "Carpentry" },
  { label: "Electrical", icon: Zap, service: "Electrical" },
  { label: "View All", icon: Ellipsis, service: "all" },
];

export const masters = [
  {
    id: 1,
    name: "Marcus Thorne",
    role: "Master Craftsman",
    rating: "4.9",
    jobs: "128 jobs",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop",
    skills: ["carpentry", "general"],
  },
  {
    id: 2,
    name: "Elena Rossi",
    role: "Master Builder",
    rating: "4.8",
    jobs: "94 jobs",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
    skills: ["carpentry", "building"],
  },
  {
    id: 3,
    name: "Samuel Chen",
    role: "Advanced Plumber",
    rating: "4.8",
    jobs: "85 jobs",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    skills: ["plumbing", "pipes"],
  },
];

export const features = [
  {
    title: "Vetted Excellence",
    description:
      "Every pro on our list is checked for experience, quality, and reliability before they take on a job.",
    icon: ShieldCheck,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    title: "Transparent Pricing",
    description:
      "See fair estimates from the start and choose the service that fits your project and budget.",
    icon: Wallet,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-700",
  },
  {
    title: "Guaranteed Delight",
    description:
      "Work with confidence knowing trusted experts and responsive support back every booking.",
    icon: BadgeCheck,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
];
