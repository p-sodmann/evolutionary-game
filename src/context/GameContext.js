import React, { createContext, useState, useEffect } from 'react';
import Blob from '../Blob';
import Food from '../Food';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    blobs: [],
    food: [],
    statistics: {
      totalBlobs: 0,
      aliveBlobs: 0,
      averageSpeed: 0,
      averageHP: 0,
      averageAge: 0,
    },
    metricsHistory: [],
    frame:0,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [hungerRate, setHungerRate] = useState(0.75);
  const [mutationRate, setMutationRate] = useState(0.1);

  const game_x = 1024;
  const game_y = 768;

  const increaseHunger = () => setHungerRate((prev) => prev + 1);
  const decreaseHunger = () => setHungerRate((prev) => Math.max(prev - 1, 0));
  const increaseMutation = () => setMutationRate((prev) => Math.min(prev + 0.01, 1));
  const decreaseMutation = () => setMutationRate((prev) => Math.max(prev - 0.01, 0));

  const generateUniqueBlobId = () => Math.random().toString(36).substr(2, 16);

  const initializeBlobs = (count) => {
    const newBlobs = Array.from({ length: count }, () => {
      const id = generateUniqueBlobId();
      return new Blob(id, Math.random() * game_x, Math.random() * game_y);
    });

    setGameState((prevState) => ({
      ...prevState,
      blobs: newBlobs,
      statistics: {
        ...prevState.statistics,
        totalBlobs: count,
        aliveBlobs: count,
      },
    }));
  };

  const initializeFood = (count) => {
    const initialFood = Array.from({ length: count }, () => {
      const x = Math.random() * game_x;
      const y = Math.random() * game_y;
      const id = generateUniqueBlobId();
      return new Food(id, x, y);
    });
    setGameState((prevState) => ({
      ...prevState,
      food: initialFood,
    }));
  };

  const spawnFood = () => {
    const id = generateUniqueBlobId();
    const newFood = new Food(id, Math.random() * game_x, Math.random() * game_y);
    return newFood;
  };

  const cloneBlob = (blob) => {
    const id = generateUniqueBlobId();
    const newBlob = new Blob(id, Math.random() * game_x, Math.random() * game_y);

    if (blob) {
      newBlob.speed = Math.max(0.1, Number(blob.speed) + (Math.random() - 0.5) * mutationRate);
      newBlob.attack = Math.max(0, Number(blob.attack) + (Math.random() - 0.5) * mutationRate);
      newBlob.defense = Math.max(0, Number(blob.defense) + (Math.random() - 0.5) * mutationRate);
      newBlob.generation = blob.generation + 1;

      newBlob.network.weights = blob.network.weights.map((layer) =>
        layer.map((neuron) => neuron.map((weight) => weight + (Math.random() - 0.5) * mutationRate))
      );
    }

    return newBlob;
  };

  const updateGameState = () => {
    if (!isRunning) return;

    setGameState((prevState) => {
      const updatedBlobs = prevState.blobs.map((blob) => {
        blob.hunger += hungerRate;
        blob.update(prevState.food, prevState.blobs.filter((b) => b.id !== blob.id));

        if (blob.hunger >= 100) blob.despawn = true;
        return blob;
      });

      const aliveBlobs = updatedBlobs.filter((blob) => !blob.despawn);
      while (aliveBlobs.length < updatedBlobs.length) {
        // const randomBlob = aliveBlobs[Math.floor(Math.random() * aliveBlobs.length)];
        // take one of the oldest 10 blobs and clone it
        const randomBlob = aliveBlobs.sort((a, b) => a.age - b.age).slice(0, 10)[Math.floor(Math.random() * 10)];
        aliveBlobs.push(cloneBlob(randomBlob));
      }

      // check proximity of blob and food
      for (let i = 0; i < aliveBlobs.length; i++) {
        for (let j = 0; j < prevState.food.length; j++) {
          if (prevState.food[j].consumed) continue

          if (in_proximity(aliveBlobs[i], prevState.food[j], 16)) {
            aliveBlobs[i].hunger = Math.max(-250, aliveBlobs[i].hunger - 100);
            prevState.food[j].consumed = true;
            aliveBlobs[i].isEating = true;
            setTimeout(() => {
              aliveBlobs[i].isEating = false; // Clear eating state after blink effect
            }, 200); // Duration matches CSS animation time
          }
        }
      }
      const remainingFood = prevState.food.filter((f) => !f.consumed)
      for (let i = 0; i < 100 - remainingFood.length; i++) {
        remainingFood.push(spawnFood());
      }

      const aliveBlobsCount = aliveBlobs.filter((blob) => blob.hp > 0).length;
      const averageSpeed = aliveBlobs.reduce((sum, blob) => sum + blob.speed, 0) / aliveBlobs.length || 0;
      const averageHP = aliveBlobs.reduce((sum, blob) => sum + blob.hp, 0) / aliveBlobs.length || 0;
      const averageAge = aliveBlobs.reduce((sum, blob) => sum + blob.age, 0) / aliveBlobs.length || 0;

      

      return {
        ...prevState,
        blobs: aliveBlobs,
        food: remainingFood,
        statistics: {
          ...prevState.statistics,
          aliveBlobs: aliveBlobsCount,
          averageSpeed,
          averageHP,
          averageAge,
        },
        frame: prevState.frame + 1,
        // every 100 frames update metrics
        metricsHistory: prevState.frame % 100 === 0 ? [...prevState.metricsHistory, 
          { timestamp: Date.now(), averageAge },
        ] : prevState.metricsHistory

      };
    });
  };

  const toggleGame = () => setIsRunning((prev) => !prev);

  const resetGame = () => {
    initializeBlobs(150);
    initializeFood(450);
  };

  const in_proximity = (object_a, object_b, distance) => {
    // account for radius
    return (
      ((object_a.x + object_a.width / 2) - (object_b.x + object_b.width / 2)) ** 2 + 
      ((object_a.y + object_a.height / 2) - (object_b.y + object_b.height / 2)) ** 2) < distance ** 2;
  }

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(updateGameState, 1000 / 140);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        isRunning,
        toggleGame,
        resetGame,
        increaseHunger,
        decreaseHunger,
        increaseMutation,
        decreaseMutation,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};



export { GameContext, GameProvider };
