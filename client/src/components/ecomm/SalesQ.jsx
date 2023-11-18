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
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesQ({ sales }) {
  const labels = [],
    q = [];
  if (sales !== undefined && sales.length !== undefined && sales.length > 0) {
    sales.map((sale) => {
      labels.push(sale.Periodo);
      q.push(sale.CantidadVentas);
    });
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ventas por Período",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Cantidad",
        data: q,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
