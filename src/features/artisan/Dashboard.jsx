"use client";

import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  LineChart,
  Plus,
  Wallet,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useAuth } from "@/hooks/useAuth";
import useArtisanStore from "@/store/artisanStore";
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const allMockJobs = [
  {
    id: "req-101",
    initials: "AS",
    name: "Ahmed Salem",
    location: "Zayed Regency - Block B",
    message:
      "I need a professional carpenter to fix a broken kitchen cabinet door and reinforce the hinges.",
    age: "5m ago",
    price: 150,
    service: "Carpentry",
  },
  {
    id: "req-102",
    initials: "KM",
    name: "Khaled Mansour",
    location: "New Cairo - District 5",
    message:
      "Sudden electrical short in the main living room. Some outlets are not working.",
    age: "22m ago",
    price: 300,
    service: "Electrical",
  },
  {
    id: "req-103",
    initials: "SY",
    name: "Sara Yassin",
    location: "Maadi Degla - St. 250",
    message:
      "General maintenance required for 3 AC units. Cleaning and gas check needed.",
    age: "1h ago",
    price: 450,
    service: "HVAC",
  },
  {
    id: "req-104",
    initials: "MA",
    name: "Mohamed Ali",
    location: "Sheikh Zayed - Villa 12",
    message: "Water pipe burst in the kitchen. Need immediate plumbing repair.",
    age: "10m ago",
    price: 200,
    service: "Plumbing",
  },
  {
    id: "req-105",
    initials: "NH",
    name: "Nadia Hassan",
    location: "Heliopolis - St. 15",
    message: "Need the whole apartment painted. 3 bedrooms and living room.",
    age: "35m ago",
    price: 800,
    service: "Painting",
  },
  {
    id: "req-106",
    initials: "RF",
    name: "Rami Fathi",
    location: "6th October - District 3",
    message: "Garden needs trimming and landscaping. About 200 sqm.",
    age: "2h ago",
    price: 350,
    service: "Gardening",
  },
  {
    id: "req-107",
    initials: "LG",
    name: "Laila Gamal",
    location: "Zamalek - St. 12",
    message:
      "Deep cleaning for a 4-bedroom apartment. Including windows and kitchen.",
    age: "3h ago",
    price: 250,
    service: "Cleaning",
  },
  {
    id: "req-108",
    initials: "OK",
    name: "Omar Khaled",
    location: "Nasr City - Block 8",
    message: "Washing machine not spinning. Need appliance repair urgently.",
    age: "45m ago",
    price: 180,
    service: "Appliance Repair",
  },
  {
    id: "req-109",
    initials: "DM",
    name: "Dina Mahmoud",
    location: "Mohandeseen - St. 7",
    message: "Need additional power outlets installed in the home office.",
    age: "1.5h ago",
    price: 220,
    service: "Electrical",
  },
  {
    id: "req-110",
    initials: "AY",
    name: "Amr Youssef",
    location: "New Cairo - District 8",
    message: "Bathroom faucet replacement and pipe inspection needed.",
    age: "4h ago",
    price: 160,
    service: "Plumbing",
  },
];

const serviceCategoryMap = {
  plumbing: ["Plumbing"],
  electrical: ["Electrical"],
  carpentry: ["Carpentry"],
  hvac: ["HVAC"],
  painting: ["Painting"],
  cleaning: ["Cleaning"],
  gardening: ["Gardening"],
  appliance: ["Appliance Repair"],
};

export default function Dashboard() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const { user } = useAuth();
  const router = useRouter();

  const {
    profile,
    earnings = { today: 420, week: 2100, month: 8400, total: 25600 },
    stats = { completedJobs: 12, averageRating: 4.8, weeklyGrowth: 15 },
    jobs,
    updateJobStatus,
    addNotification,
    updateStats,
  } = useArtisanStore();

  const [handledMockJobIds, setHandledMockJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem('herfa-handled-jobs')
      return new Set(saved ? JSON.parse(saved) : [])
    } catch {
      return new Set()
    }
  })
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 3;

  const artisanCategory = user?.serviceCategory?.toLowerCase() || "";

  const filteredMockJobs = useMemo(() => {
    const allowed = serviceCategoryMap[artisanCategory] || [];
    const base = allowed.length === 0 ? allMockJobs : allMockJobs.filter((job) => allowed.includes(job.service));
    return base.filter((job) => !handledMockJobIds.has(job.id));
  }, [artisanCategory, handledMockJobIds]);

  const pendingFromStore = jobs?.pending || [];
  const filteredPendingFromStore = useMemo(() => {
    const allowed = serviceCategoryMap[artisanCategory] || [];
    if (allowed.length === 0) return pendingFromStore;
    return pendingFromStore.filter((job) => {
      const s = job.category || job.service || "";
      return allowed.some((a) => s.toLowerCase().includes(a.toLowerCase()));
    });
  }, [artisanCategory, pendingFromStore]);

  const allPendingJobs = useMemo(() => {
    return [...filteredPendingFromStore, ...filteredMockJobs];
  }, [filteredPendingFromStore, filteredMockJobs]);

  const totalPages = Math.ceil(allPendingJobs.length / requestsPerPage);

  const currentRequests = useMemo(() => {
    const start = (currentPage - 1) * requestsPerPage;
    return allPendingJobs.slice(start, start + requestsPerPage);
  }, [allPendingJobs, currentPage, requestsPerPage]);

  useEffect(() => {
    const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const data = [200, 320, 280, 380, 420, 360, 410];
    setChartData({
      labels,
      datasets: [
        {
          label: "Earnings AED",
          data,
          borderColor: "#14b8a6",
          backgroundColor: "rgba(20, 184, 166, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#14b8a6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    });
  }, []);

  useEffect(() => {
    if (!user || user.role !== "artisan") {
      router.push("/auth/login");
    }
  }, [user, router]);

  const statCards = [
    {
      title: "Today's Earnings",
      value: earnings.today.toFixed(2),
      suffix: "AED",
      note: "+12%",
      icon: Wallet,
    },
    {
      title: "Completed Jobs",
      value: stats.completedJobs.toString(),
      suffix: "Today",
      note: "On Schedule",
      icon: CheckCircle2,
    },
    {
      title: "Weekly Growth",
      value: `${stats.weeklyGrowth}%`,
      suffix: "",
      note: "Trending Up",
      icon: LineChart,
    },
  ];

  const handleAcceptJob = (jobId) => {
    setHandledMockJobIds((prev) => new Set(prev).add(jobId));
    updateJobStatus(jobId, "accepted");
    addNotification({
      type: "job_accepted",
      title: "Job Accepted",
      message: "Job accepted successfully",
    });
    updateStats();
    toast.success("Request accepted");
  };

  const handleRejectJob = (jobId) => {
    setHandledMockJobIds((prev) => new Set(prev).add(jobId));
    updateJobStatus(jobId, "cancelled");
    addNotification({
      type: "job_rejected",
      title: "Job Rejected",
      message: "Job has been rejected",
    });
    updateStats();
    toast.error("Request rejected");
  };

  useEffect(() => {
    try {
      localStorage.setItem('herfa-handled-jobs', JSON.stringify([...handledMockJobIds]))
    } catch { /* ignore */ }
  }, [handledMockJobIds])

  useEffect(() => {
    setCurrentPage(1);
  }, [artisanCategory]);

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-28 relative mt-8">
        <div className="mx-auto max-w-[1360px]">
          <button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors text-sm font-bold"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <section className="flex flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="grid gap-8 p-4 sm:p-6 lg:p-8 grid-cols-1 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-8">
                <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                      Marhaba, {user?.name?.split(" ")[0] || "Yousef"}
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                      Your artisan dashboard is ready.
                      {profile?.specialty ? ` | ${profile.specialty}` : ""}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                      Current Status
                    </p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">
                      Available for booking
                    </p>
                  </div>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <article
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                            <Icon size={22} />
                          </div>
                          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">
                            {card.note}
                          </span>
                        </div>
                        <p className="mt-6 text-xs text-slate-500">
                          {card.title}
                        </p>
                        <div className="mt-3 flex items-end gap-2">
                          <span className="text-3xl font-black text-slate-900">
                            {card.value}
                          </span>
                          <span className="pb-1 text-xs font-semibold text-slate-400">
                            {card.suffix}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-bold uppercase text-slate-700 mb-4">
                    Earnings Overview
                  </h3>
                  <div className="h-[200px]">
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                </article>
              </div>

              <aside className="flex flex-col gap-6 lg:col-span-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                      Incoming Requests
                    </p>
                  </div>
                  <span className="bg-rose-50 text-rose-500 px-2.5 py-1 rounded-full text-[10px] font-bold">
                    {allPendingJobs.length} New
                  </span>
                </div>
                <div className="flex flex-col gap-4 min-h-[420px]">
                  {currentRequests.length > 0 ? (
                    currentRequests.map((request) => (
                      <article
                        key={request.id}
                        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-teal-100 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold">
                              {request.initials}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">
                                {request.name}
                              </h4>
                              <p className="text-[10px] text-slate-400">
                                {request.location}
                              </p>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-300 uppercase">
                            {request.age}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600 mb-4">
                          {request.message}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptJob(request.id)}
                            className="flex-1 bg-teal-600 text-white py-2 rounded-xl text-[10px] font-bold hover:bg-teal-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectJob(request.id)}
                            className="flex-1 border border-slate-100 text-slate-400 py-2 rounded-xl text-[10px] font-bold hover:bg-slate-50"
                          >
                            Reject
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-slate-400 text-sm">
                        No matching requests.
                      </p>
                    </div>
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 py-2 bg-slate-50 rounded-2xl mx-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={`p-1.5 rounded-lg ${currentPage === 1 ? "text-slate-300" : "text-slate-600 hover:bg-white shadow-sm"}`}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-[10px] font-black text-slate-400">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={`p-1.5 rounded-lg ${currentPage === totalPages ? "text-slate-300" : "text-slate-600 hover:bg-white shadow-sm"}`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
                <button className="mt-auto self-end p-4 bg-teal-400 text-white rounded-full shadow-lg hover:scale-105 transition">
                  <Plus size={24} />
                </button>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
