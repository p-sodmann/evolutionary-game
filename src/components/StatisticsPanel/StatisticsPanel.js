// src/components/StatisticsPanel/StatisticsPanel.js
import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import './StatisticsPanel.css';
import MetricsChart from './MetricsChart';

const StatisticsPanel = () => {
  const { gameState } = useContext(GameContext);

  return (
    <div className="statisticsPanel">
      <h3>Statistics</h3>
      <p>Total Blobs: {gameState.statistics.totalBlobs}</p>
      <p>Alive Blobs: {gameState.statistics.aliveBlobs}</p>
      <p>Average Speed: {gameState.statistics.averageSpeed.toFixed(2)}</p>
      <p>Average HP: {gameState.statistics.averageHP.toFixed(2)}</p>
      <p>BlobCounter: {gameState.statistics.blobCounter}</p>
      <p>Average Age: {gameState.statistics.averageAge}</p>
      <p>Average Age: {gameState.statistics.averageAge}</p>

      <MetricsChart /> {/* Add the chart here */}
    </div>
    

    
  );
  
};

export default StatisticsPanel;

