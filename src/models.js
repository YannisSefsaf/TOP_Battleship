/** SHIPS */

class Ship {
  constructor(name = null, size = null) {
    this.name = name;
    this.size = size;
    this.brokenParts = [];
    this.isSunk = false;
    this.coordinates = [];
    this.isSet = false;
  }

  shootShip(index) {
    this.brokenParts.push(index);
    if (this.getHits() === this.size) {
      this.isSunk = true;
    }
  }

  getHits() {
    return this.brokenParts.length;
  }

  getCoordinates() {
    return this.coordinates;
  }
}

class Carrier extends Ship {
  constructor() {
    super("Carrier", 5);
  }
}

class Battleship extends Ship {
  constructor() {
    super("Battleship", 4);
  }
}

class Destroyer extends Ship {
  constructor() {
    super("Destroyer", 3);
  }
}

class Submarine extends Ship {
  constructor() {
    super("Submarine", 3);
  }
}

class PatrolBoat extends Ship {
  constructor() {
    super("PatrolBoat", 2);
  }
}

/** BOARD */

class Board {
  constructor(fleet = []) {
    this.board = new Array(100).fill(null);
    this.visitedCells = [];
    this.attackedCells = [];
    this.allShipsSunk = false;
    this.currentDirection = "horizontal";
    this.fleet = fleet;
  }

  /** SET SHIP ON BOARD */

  setShipOnBoard(boat, index) {
    // Check whether the ship can be placed
    let canBePlaced = true;
    if (this.currentDirection === "horizontal") {
      canBePlaced = this.canBePlacedHorizontally(index, boat.size);
    } else {
      canBePlaced = this.canBePlacedVertically(index, boat.size);
    }

    // If it can be placed, add the boat to the board
    if (canBePlaced) {
      let boatCoordinates = this.setShipCoordinates(boat, index);
      this.addShipToBoard(boatCoordinates, boat.name);
    } else {
      console.log(
        `Unable to add boat ${boat.name} as the cells are already occupied`
      );
    }
  }

  addShipToBoard(boatCoordinates, boatName) {
    for (let cell of boatCoordinates) {
      this.board[cell] = boatName;
      this.visitedCells.push(cell);
    }
  }

  /** SET SHIP ON COORDINATES */

  // This is a method that sets the ship coordinates for a given boat object, and adds it to the fleet array. It returns the coordinates of the ship.
  // Set ship coordinates
  setShipCoordinates(boat, index) {
    // Check if the ship fits in the board
    let isFit = this.isShipFit(boat, index);
    // Check if the boat is already set && isfit
    if (isFit && !boat.isSet) {
      // Push the boat object to the fleet array
      this.fleet.push(boat);
      // Change the boat.isSet value to true
      boat.isSet = true;
      // Set coordinates
      this.setShipCoordinatesByDirection(boat, index);
    } else {
      if (boat.isSet) {
        // If the boat is already set, log a message
        console.log(`Boat already set!`);
      } else {
        // If the boat is not fit, log a message
        console.log(`Boat not fit!`);
      }
    }
    // Return the ship coordinates
    return boat.coordinates;
  }

  // setShipCoordinatesByDirection loops through each coordinate of the ship and adds it to the array of coordinates
  setShipCoordinatesByDirection(boat, index) {
    if (this.currentDirection === "vertical") {
      for (let i = 0; i < boat.size; i++) {
        // here we add the index (which is the first coordinate of the ship) to the array
        boat.coordinates.push(index + i * 10);
      }
    } else if (this.currentDirection === "horizontal") {
      for (let i = 0; i < boat.size; i++) {
        boat.coordinates.push(index + i);
      }
    }
  }

  /** ATTACK BOARD */

  // This code will make sure that the index is not null, if it is not null, it will find the ship and shoot it.

  receiveAttack(index) {
    if (this.board[index] != null && !this.attackedCells.includes(index)) {
      this.shootShip(index);
      this.checkSunk();
      return "success";
    } else if (this.attackedCells.includes(index)) {
      return "already-attacked";
    } else {
      this.attackedCells.push(index);
      return "empty";
    }
  }

  checkAttack(index) {
    if (this.attackedCells.includes(index)) {
      return true;
    } else {
      return false;
    }
  }

  shootShip(index) {
    this.findShip(index).shootShip(index);
    this.attackedCells.push(index);
  }

  /** CHECK SUNK & SET */

  checkSunk() {
    this.allShipsSunk = this.fleet.every((boat) => boat.isSunk);
    if (!this.allShipsSunk) {
      return false;
    }
    console.log("All ships sunk!");
    return true;
  }

  checkSet() {
    this.allShipsSet = this.fleet.every((boat) => boat.isSet);
    if (!this.allShipsSet) {
      return false;
    }
    console.log("All ships set!");
    return true;
  }
  /** FIND SHIP */

  findShip(index) {
    return this.fleet.find((boat) => boat.name === this.board[`${index}`]);
  }
  /** DIRECTION */

  switchCurrentDirection() {
    if (this.currentDirection === "vertical") {
      this.currentDirection = "horizontal";
    } else if (this.currentDirection === "horizontal") {
      this.currentDirection = "vertical";
    }
  }

  getCurrentDirection() {
    return this.currentDirection;
  }

  setCurrentDirection(direction) {
    this.currentDirection = direction;
  }

  /** HELPER FUNCTIONS - CHECK FIT */

  // Checks if a ship of a given size can be placed at index in the grid
  // occupiedCells - an array of all the cells that are already occupied by a ship
  // index - the index of the cell that we are trying to place the ship in
  // currentDirection - the direction in which the ship is being placed (horizontal or vertical)
  canShipBePlaced(size, currentDirection, occupiedCells, index) {
    // Assume that the ship can be placed
    let canBePlaced = true;

    // If the ship is being placed horizontally and the index is in the range of the grid
    // where the ship can be placed
    if (currentDirection === "horizontal" && index % 10 <= 10 - size) {
      // Check if any of the cells that the ship will occupy are already occupied
      for (let j = 0; j < size; j++) {
        if (occupiedCells.includes(index + j)) {
          // If the cell is already occupied, the ship cannot be placed
          canBePlaced = false;
          // Break out of the loop because we don't need to check any more cells
          break;
        }
      }
    } else if (
      currentDirection === "vertical" &&
      index < 100 - (size - 1) * 10
    ) {
      // Check if any of the cells that the ship will occupy are already occupied
      for (let j = 0; j < size; j++) {
        if (occupiedCells.includes(index + j * 10)) {
          // If the cell is already occupied, the ship cannot be placed
          canBePlaced = false;
          // Break out of the loop because we don't need to check any more cells
          break;
        }
      }
    } else {
      // If the ship cannot be placed for any reason, it can't be placed
      canBePlaced = false;
    }
    return canBePlaced;
  }

  isCellAvailable(index) {
    return !this.visitedCells.includes(index);
  }

  isShipFit(boat, index) {
    let isFit = false;
    if (this.currentDirection === "horizontal") {
      isFit = index % 10 <= 10 - boat.size;
    } else {
      isFit = index < 100 - (boat.size - 1) * 10;
    }
    return isFit;
  }

  canBePlacedHorizontally(index, size) {
    let canBePlaced = true;
    for (let i = 0; i < size; i++) {
      if (!this.isCellAvailable(index + i)) {
        canBePlaced = false;
        break;
      }
    }
    return canBePlaced;
  }

  canBePlacedVertically(index, size) {
    let canBePlaced = true;
    for (let i = 0; i < size; i++) {
      if (!this.isCellAvailable(index + 10 * i)) {
        canBePlaced = false;
        break;
      }
    }
    return canBePlaced;
  }
}

/** PLAYERS */

class Player {
  constructor(name, fleet = []) {
    this.name = name;
    this.playerBoard = new Board();
    this.carrier = new Carrier();
    this.battleship = new Battleship();
    this.destroyer = new Destroyer();
    this.submarine = new Submarine();
    this.patrolBoat = new PatrolBoat();
    this.fleet = fleet;
    this.fleet.push(
      this.carrier,
      this.battleship,
      this.destroyer,
      this.submarine,
      this.patrolBoat
    );
  }

  getPlayerBoard() {
    return this.playerBoard;
  }

  checkSet() {
    this.allShipsSet = this.fleet.every((boat) => boat.isSet);
    if (!this.allShipsSet) {
      return false;
    }
    console.log("All ships set!");
    return true;
  }
}

class Computer extends Player {
  constructor() {
    super();
    this.name = "Computer";
    this.availableCells = new Set();
    this.generateSet();
    this.setShipsRandomly();
  }

  generateSet() {
    for (let i = 0; i < 100; i++) {
      this.availableCells.add(i.toString());
    }
  }

  getRandomCell() {
    const randomIndex = Math.floor(Math.random() * this.availableCells.size);
    const randomCell = [...this.availableCells][randomIndex];
    this.availableCells.delete(randomCell);
    return randomCell;
  }

  setShipRandomly(boat) {
    let randomCell, direction, canSetShip;

    do {
      // Pick a random cell and direction
      randomCell = this.getRandomCell();
      const directions = ["horizontal", "vertical"];
      const directionIndex = Math.floor(Math.random() * 2);
      direction = directions[directionIndex];
      // Check if the ship can be placed in the current direction
      canSetShip = this.playerBoard.canShipBePlaced(
        boat.size,
        direction,
        this.playerBoard.visitedCells,
        parseInt(randomCell)
      );
    } while (!canSetShip);

    // If all the cells required for the ship are available, set the ship on the board
    const cellIndex = parseInt(randomCell);
    this.playerBoard.setCurrentDirection(direction);
    this.playerBoard.setShipOnBoard(boat, cellIndex);
  }

  setShipsRandomly() {
    this.setShipRandomly(this.carrier);
    this.setShipRandomly(this.battleship);
    this.setShipRandomly(this.destroyer);
    this.setShipRandomly(this.submarine);
    this.setShipRandomly(this.patrolBoat);
  }
}

/** GAME AND BOARDVIEW */

class Game {
  constructor(playerOne = null) {
    if (!(playerOne instanceof Player)) {
      throw new Error("Invalid playerOne");
    }
    this.playerOne = playerOne;
    this.computer = new Computer();
  }
}

export { Game, Player, Computer, Board };
