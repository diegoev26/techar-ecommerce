import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function Sales$({ sales }) {
  const labels = [],
    q = [];
  if (sales !== undefined && sales.length !== undefined && sales.length > 0) {
    sales.map((sale) => {
      labels.push(sale.Periodo);
      q.push(sale.ImporteVentasSinImpuestos);
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
        text: "Importe por Período",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Importe $",
        data: q,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
