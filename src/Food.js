// src/Food.js

class Food {
  constructor(id, x, y, size = 1) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.type = 1; // Identifier for food
    this.size = size;
    this.hp = 0; // Food doesn't have HP
    this.attack = 0; // Food has no attack
    this.defense = 0; // Food has no defense
    this.consumed = false; // Flag to remove food from environment
  }
}

export default Food;