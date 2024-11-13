// src/components/MetricsChart.js
import React, { useContext } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { GameContext } from '../../context/GameContext';

// Register the components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MetricsChart = () => {
  const { gameState } = useContext(GameContext);

  console.log(gameState.metricsHistory)
  // check if the metricsHistory is empty
  if (!gameState.metricsHistory) {
    return null;
  }

  // Extract average age data points for the chart
  const labels = gameState.metricsHistory.map((entry) =>
    new Date(entry.timestamp).toLocaleTimeString()
  );
  const averageAgeData = gameState.metricsHistory.map((entry) => entry.averageAge);

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Age',
        data: averageAgeData,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Time' },
      },
      y: {
        title: { display: true, text: 'Average Age' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '600px', height: '300px', margin: '20px auto' }}>
      <h3>Average Age Over Time</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default MetricsChart;
