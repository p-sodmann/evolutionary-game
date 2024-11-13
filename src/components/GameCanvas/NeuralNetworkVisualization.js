// src/components/NeuralNetworkVisualization.js
import React, { useRef, useEffect } from 'react';

const NeuralNetworkVisualization = ({ visionData, decision }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dimensions and layout settings
    const neuronRadius = 5;
    const layerGap = 100;
    const xOffset = 50;
    const yOffset = 20;
    const maxNeuronsPerLayer = Math.max(visionData.length / 6, 3, 2); // 16 inputs, hidden layers, and 2 outputs
    const neuronGap = canvas.height / (maxNeuronsPerLayer + 1);

    // Helper function to draw neurons
    const drawNeuron = (x, y, isInput, value) => {
      ctx.beginPath();
      ctx.arc(x, y, neuronRadius, 0, 2 * Math.PI);
      ctx.fillStyle = isInput ? `rgba(0, 0, 255, ${Math.min(Math.abs(value), 1)})` : `rgba(255, 0, 0, ${Math.min(Math.abs(value), 1)})`;
      ctx.fill();
      ctx.stroke();
    };

    // Helper function to draw connections
    const drawConnection = (x1, y1, x2, y2) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Draw input layer
    const inputLayer = visionData.map((value, i) => {
      const x = xOffset;
      const y = yOffset + i * neuronGap;
      drawNeuron(x, y, true, value);
      return { x, y, value };
    });

    // Draw hidden layer(s) (for simplicity, assuming two hidden layers with 10 neurons each)
    const hiddenLayer1 = Array.from({ length: 10 }, (_, i) => {
      const x = xOffset + layerGap;
      const y = yOffset + i * neuronGap;
      drawNeuron(x, y, false, Math.random()); // Placeholder for actual neuron value
      return { x, y };
    });

    const hiddenLayer2 = Array.from({ length: 10 }, (_, i) => {
      const x = xOffset + 2 * layerGap;
      const y = yOffset + i * neuronGap;
      drawNeuron(x, y, false, Math.random()); // Placeholder for actual neuron value
      return { x, y };
    });

    // Draw output layer
    const outputLayer = decision.map((value, i) => {
      const x = xOffset + 3 * layerGap;
      const y = yOffset + i * neuronGap;
      drawNeuron(x, y, false, value);
      return { x, y, value };
    });

    // Draw connections (for demonstration; actual weights and connections are illustrative)
    inputLayer.forEach((inputNeuron) => {
      hiddenLayer1.forEach((hiddenNeuron) => {
        drawConnection(inputNeuron.x, inputNeuron.y, hiddenNeuron.x, hiddenNeuron.y);
      });
    });

    hiddenLayer1.forEach((hiddenNeuron) => {
      hiddenLayer2.forEach((hiddenNeuron2) => {
        drawConnection(hiddenNeuron.x, hiddenNeuron.y, hiddenNeuron2.x, hiddenNeuron2.y);
      });
    });

    hiddenLayer2.forEach((hiddenNeuron2) => {
      outputLayer.forEach((outputNeuron) => {
        drawConnection(hiddenNeuron2.x, hiddenNeuron2.y, outputNeuron.x, outputNeuron.y);
      });
    });
  }, [visionData, decision]);

  return <canvas ref={canvasRef} width={400} height={400} />;
};

export default NeuralNetworkVisualization;
