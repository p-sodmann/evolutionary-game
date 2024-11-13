// src/components/VisionIndicator.js
import React, { useRef, useEffect } from 'react';

const VisionIndicator = ({ visionData }) => {
  const canvasRef = useRef(null);
  const sectorCount = 16;
  const radius = 50;
  const donutThickness = 15;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxDistance = 200;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Log the vision data for debugging

    visionData.forEach((data, index) => {
      const [distance, type, size, hp, attack, defense] = data;
      const offset = 8
      const sectorStartAngle = (2 * Math.PI * (index+offset) + Math.PI) / sectorCount;
      const sectorEndAngle = (2 * Math.PI * (index + 1 + offset) + Math.PI) / sectorCount;

      // Calculate intensity for distance (red), type (green), and hp (blue) for debugging purposes
      const distanceIntensity = 1 - Math.min(distance / maxDistance, 1);
      const typeIntensity = type / 3; // Assuming type is 1 (food) or 2 (other blob)
      const hpIntensity = Math.min(hp / 100, 1); // Assuming max HP of 100

      // Temporary color to visually differentiate attributes
      const color = `rgba(${distanceIntensity * 255}, ${typeIntensity * 255}, ${hpIntensity * 255}, 0.8)`;

      // Draw sector as a donut segment
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, sectorStartAngle, sectorEndAngle);
      ctx.arc(centerX, centerY, radius - donutThickness, sectorEndAngle, sectorStartAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    });
  }, [visionData]);

  return <canvas ref={canvasRef} width="120" height="120" />;
};

export default VisionIndicator;
