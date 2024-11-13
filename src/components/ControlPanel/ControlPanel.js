// src/components/ControlPanel/ControlPanel.js
import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';

const ControlPanel = () => {
  const { 
    isRunning, toggleGame, resetGame, increaseHunger, decreaseHunger, gameState, increaseMutation, decreaseMutation, mutationRate
  } = useContext(GameContext);


  return (
    <div className="controlPanel">
      <h3>Control Panel</h3>
      <button onClick={toggleGame}>{isRunning ? 'Pause' : 'Start'}</button>
      <button onClick={resetGame}>Reset</button>
      <button onClick={increaseHunger}>Increase Hunger Rate</button>
      <button onClick={decreaseHunger}>Decrease Hunger Rate</button>

      <p>Current Hunger Rate: {gameState.statistics.hungerRate || 0}</p> {/* Display hunger rate */}

      <div>
      <button onClick={increaseMutation}>Increase Mutation Rate</button>
      <button onClick={decreaseMutation}>Decrease Mutation Rate</button>
      <p>Current Mutation Rate: {mutationRate?.toFixed(2)}</p>
    </div>
      
    </div>
  );
};

export default ControlPanel;
