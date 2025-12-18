import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PersonSummaryChart = ({ revenue }) => {
  const labels = [
    "Součet za aktuální rok",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Kč",
        data: [revenue ?? 0],
        backgroundColor: ["#0d6efd"],
        borderColor: "#000000",
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Přehled fakturačních statistik",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto 2rem auto" }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default InvoiceSummaryChart;
