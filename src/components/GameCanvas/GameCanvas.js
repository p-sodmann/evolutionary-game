// src/components/GameCanvas/GameCanvas.js
import React, { useContext, useState } from 'react';
import { GameContext } from '../../context/GameContext';
import './GameCanvas.css';
import NeuralNetworkVisualization from './NeuralNetworkVisualization';
import VisionIndicator from './VisionIndicator';


const GameCanvas = () => {
  const { gameState } = useContext(GameContext);
  const [hoveredBlob, setHoveredBlob] = useState(null);
  const [selectedBlob, setSelectedBlob] = useState(null);

  const getBlobColor = (age) => {
    const maxAge = 1000; // Set a max age for full red color transition
    const ageRatio = Math.min(age / maxAge, 1); // Clamp between 0 and 1
    const red = Math.floor(255 * ageRatio);
    const green = Math.floor(255 * (1 - ageRatio));
    return `rgb(${red}, ${green}, 0)`; // Transition from green to red
  };


  // Handle mouseover and mouseout for temporary stats
  const handleMouseOver = (blob) => {
    setHoveredBlob(blob);
  };

  const handleMouseOut = () => {
    setHoveredBlob(null);
  };

  // Handle click to persist the stats display
  const handleClick = (blob) => {
    setSelectedBlob(blob);
  };

  // Close the persistent stats display
  const closeStats = () => {
    setSelectedBlob(null);
  };

  return (
    <div className="gameCanvas" onClick={() => setSelectedBlob(null)}>
      {gameState.food.map((food) => (
        <div
          key={`food-${food.id}`} // Ensure a unique and consistent key for each food item
          className="food"
          style={{
            left: food.x, // Add a slight wobble effect
            top: food.y,
            border: food.consumed ? '1px solid red' : 'none',
          }}
        />
      ))}
      {gameState.blobs.map((blob) => (
        <div
          key={`blob-${blob.id}`} // Each blob now has a guaranteed unique ID
          className={`blob ${blob.isEating ? 'blink' : ''}`} // Apply blink class conditionally
          style={{
            left: blob.x,
            top: blob.y,
            backgroundColor: getBlobColor(blob.age),
          }}
          onMouseOver={() => handleMouseOver(blob)}
          onMouseOut={handleMouseOut}
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from closing stats
            handleClick(blob);
          }}
        />
      ))}
      {hoveredBlob && (
        <div
          className="blob-stats"
          style={{ left: hoveredBlob.x + 20, top: hoveredBlob.y }}
        >
          <BlobStats blob={hoveredBlob} />
        </div>
      )}
      {selectedBlob && (
        <div className="blob-stats-persistent">
          <button onClick={() => setSelectedBlob(null)}>Close</button>
          <BlobStats blob={selectedBlob} />
        </div>
      )}
      
    </div>
    
  );
};


const BlobStats = ({ blob }) => {
  // Directly access blob's visionData array, each element is already a 6-item array
  const visionData = Array.isArray(blob.visionData) && blob.visionData.length === 16
    ? blob.visionData
    : Array(16).fill([-1, 0, 0, 0, 0, 0]); // Default fallback vision data

  const decision = blob.network.run(visionData.flat());

  return (
    <div>
      <p><strong>Blob ID:</strong> {blob.id}</p>
      <p><strong>HP:</strong> {blob.hp}</p>
      <p><strong>Hunger:</strong> {blob.hunger}</p>
      <p><strong>Speed:</strong> {blob.speed.toFixed(2)}</p>
      <p><strong>Attack:</strong> {blob.attack.toFixed(2)}</p>
      <p><strong>Defense:</strong> {blob.defense.toFixed(2)}</p>
      <p><strong>Generation:</strong> {blob.generation}</p>
      <p><strong>Age:</strong> {blob.age}</p>

      {/* Vision Indicator */}
      <h4>Vision Indicator</h4>
      <VisionIndicator visionData={visionData} />

      {/* Neural Network Visualization */}
      <h4>Neural Network</h4>
      <NeuralNetworkVisualization visionData={visionData.flat()} decision={decision} />
    </div>
  );
};

export default GameCanvas;
