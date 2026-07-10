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

const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const defaultData = [200, 320, 280, 380, 420, 360, 410];

export default function EarningsChart({ earningsData }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const todayVal = earningsData?.today;
    const data = todayVal != null
      ? [...defaultData.slice(0, -1), todayVal]
      : defaultData;
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
  }, [earningsData?.today]);

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
