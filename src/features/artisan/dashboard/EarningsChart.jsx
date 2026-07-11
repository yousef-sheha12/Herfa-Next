"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function EarningsChart({ earningsData, completedJobs }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const dailyEarnings = [0, 0, 0, 0, 0, 0, 0];

    if (Array.isArray(completedJobs)) {
      completedJobs.forEach((job) => {
        const jobDate = new Date(job.date || job.completedAt || job.updatedAt || job.createdAt || "");
        if (jobDate >= startOfWeek) {
          const dayIndex = jobDate.getDay();
          dailyEarnings[dayIndex] += job.price || job.Price || 0;
        }
      });
    }

    const hasRealData = dailyEarnings.some((v) => v > 0);
    const data = hasRealData ? dailyEarnings : [0, 0, 0, 0, 0, 0, 0];

    setChartData({
      labels: dayLabels,
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
  }, [earningsData?.today, completedJobs]);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-xs font-bold uppercase text-slate-700 mb-4">Earnings Overview</h3>
      <div className="h-[200px]">
        <Line
          data={chartData}
          options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
        />
      </div>
    </article>
  );
}
