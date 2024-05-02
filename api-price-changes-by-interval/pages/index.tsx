import Image from "next/image";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { useState, useEffect } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
\
 ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {

  const [priceData, setPriceData] = useState<Token[]>([]);

  const labels = priceData.map(token => {
      const date = new Date(token.timestamp * 1000);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      
      return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    });

  const apiUrl = `https://api.fuse.io/api/v0/trade/pricechange/interval/HOUR/0xDe4b9879B56187D13B2c41Da24c72Ff100A5AC9A?apiKey={API_KEY}`

  async function fetchData() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setPriceData(data.data);
        } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }

  fetchData();

  const data = {
    labels,
    datasets: [
      {
        label: 'LadyBot Token Price Change Per Hour',
        data: priceData.map((token) => token.currentPrice),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };


  return (
    <main className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}>
      Hello, World!
      <Line options={options} data={data} />
    </main>
  );
}
