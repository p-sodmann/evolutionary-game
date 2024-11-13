// src/Blob.js
import { NeuralNetwork } from 'brain.js';

const MAX_VISION_DISTANCE = 200; // Define maximum vision distance in pixels

class Blob {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.speed = Math.random() * 5 + 1;
    this.hp = 100;
    this.attack = Math.random() * 10;
    this.defense = Math.random() * 10;
    this.visionRadius = Math.min(Math.random() * 50 + 50, MAX_VISION_DISTANCE);
    this.direction = { x: 0, y: 0 };
    this.hunger = 0;
    this.age = 0;
    this.visionData = Array(16).fill([-1, 0, 0, 0, 0, 0]); // Default vision data
    this.despawn = false;
    this.isEating = false;
    this.generation = 0;

    // Initialize neural network
    this.network = new NeuralNetwork({
      inputSize: 16 * 6, // 16 sectors with 6 inputs each
      hiddenLayers: [10, 10], // Two hidden layers with 3 neurons each
      outputSize: 2, // Left-right and up-down movement
      activation: 'tanh',
    });
    this.network.initialize();
  }

  // Perceive surroundings in 16 sectors
  perceive(environment) {
    this.visionData = Array(16).fill([200, 0, 0, 0, 0, 0]); // Reset vision data

    environment.forEach((object) => {
      if (!object) return;

      const distance = Math.sqrt((object.x - this.x) ** 2 + (object.y - this.y) ** 2);
      if (distance < this.visionRadius) {
        const angle = Math.atan2(object.y - this.y, object.x - this.x);
        const sector = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * 15);

        // Only update if within vision radius and closer than current value
        if (distance < this.visionData[sector][0]) {
          this.visionData[sector] = [
            distance / (MAX_VISION_DISTANCE/ 2) - 1,
            object.type || 0,
            object.size || 0,
            object.hp || 0,
            object.attack || 0,
            object.defense || 0,
          ];
        }
      }
    });

    // if 200 check if "walls" are in vision
    // to check, we will take the position of the blob and check if it is within 200 pixels of the border (0 or 1024, 0 or 768)
    // if it is, we will add a "wall" to the vision data
    if (this.x < 200  && this.visionData[15][0] > this.x / 200 - 1) {
      this.visionData[15] = [this.x / 200 - 1, 3, 0, 0, 0, 0];
    }
    if (this.x > 824 && this.visionData[7][0] > (1024 - this.x) / 200 - 1) {
      this.visionData[7] = [(1024 - this.x) / 200 - 1, 3, 0, 0, 0, 0];
    }
    if (this.y < 200 && this.visionData[3][0] > this.y / 200 - 1) {
      this.visionData[3] = [this.y / 200 - 1, 3, 0, 0, 0, 0];
    }
    if (this.y > 568 && this.visionData[11][0] > (768 - this.y) / 200 - 1) {
      this.visionData[11] = [(768 - this.y) / 200 - 1, 3, 0, 0, 0, 0];
    }
  }

  // Decide movement based on neural network output
  decide() {    
    const output = this.network.run(this.visionData.flat());
    const [leftRight, upDown] = output;

    // Normalize movement to a unit vector
    const magnitude = Math.sqrt(leftRight ** 2 + upDown ** 2);
    this.direction = {
      x: (magnitude > 1 ? leftRight / magnitude : leftRight) * this.speed,
      y: (magnitude > 1 ? upDown / magnitude : upDown) * this.speed,
    };
  }

  // Update position based on direction
  move() {
    if (isNaN(this.direction.x) || isNaN(this.direction.y)) {
      console.error(`Invalid direction for blob ${this.id}:`, this.direction);
      return;
    }

    // Bound movement within game area
    this.x = Math.max(0, Math.min(this.x + this.direction.x, 1024)); // Canvas width
    this.y = Math.max(0, Math.min(this.y + this.direction.y, 768)); // Canvas height
  }

  // Main behavior loop: perceive, decide, and move
  update(blobs, food) {
    let environment = [...blobs, ...food]; // Combine blobs and food for perception
    this.perceive(environment);
    this.decide(this.visionData.flat());
    this.move();
    this.age += 1;

    return null; // Return null if no food was consumed
  }

  eat() {
    this.hunger = Math.max(0, this.hunger - 50); // Decrease hunger, ensure it doesn't go below 0
    this.isEating = true;    
  }

  isCloseTo(food) {
    const distance = Math.sqrt((food.x - this.x) ** 2 + (food.y - this.y) ** 2);
    return distance < 16; // Close enough to eat
  }
}

export default Blob;
