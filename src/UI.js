import { Game, Player } from "./models";

class BoardView {
  constructor(game = null) {
    this.game = game;
    this.fleet = null;
    this.currentDirection = null;
    this.mouseLeaveListener = null;
    this.playerTurn = null;
    this.currentShip = null;

    /* QUERY SELECTORS */
    this.startGameButton = document.querySelector("#startGame");
    this.form = document.querySelector("form");
    this.playerName = this.form.querySelector("#playerName");
    this.positioningBoard = document.querySelector(
      `[data-set="positioningBoard"]`
    );
    this.computerGrid = this.positioningBoard.querySelectorAll(
      `[data-set="grid-item"]`
    );
    this.currentDirectionDiv = document.querySelector(
      `[data-set="currentDirection"]`
    );
    this.playerBoard = document.querySelector(`[data-set="playerBoard"]`);
    this.gridItem = document.querySelectorAll(`[data-set="grid-item"]`);
    this.playerGrid = this.playerBoard.querySelectorAll(
      `[data-set="grid-item"]`
    );
    this.datGrid = document.querySelector(".main__container__board");
    this.instruction = document.querySelector("#instruction");
    this.currentDirectionSelector = document.querySelector("#currentDirection");
    this.rotate = document.querySelector(".rotate");
    this.playerOneName = document.querySelector(`[data-set="playerOne"]`);

    this.bindEvents();
  }

  bindEvents() {
    this.startGameButton.addEventListener("click", (e) => {
      e.preventDefault();
      let mainPlayer = new Player(this.playerName.value);
      this.fleet = mainPlayer.fleet;
      console.log(this.fleet);
      this.playerOneName.textContent = `${mainPlayer.name}'s board`;
      let newGame = new Game(mainPlayer);
      this.game = newGame;
      this.toggleForm();
      this.toggleGrid();
      this.updateDirection();
      this.placeNextShip();
      /*       this.triggerCarrierSequence(); */
    });

    this.rotate.addEventListener("click", () => {
      this.currentDirection = this.switchCurrentDirection();
    });
  }

  startGame() {
    this.playerTurn = true;
    this.activeCells();
    this.playTurn();
    this.instruction.textContent = `${this.game.playerOne.name}'s turn...`;
  }

  shipHoverListener(e) {
    const currentIndex = Array.from(this.gridItem).indexOf(e.target);
    const shipLength = this.currentShip.size;
    let isFit = false;

    if (this.currentDirection === "horizontal") {
      isFit = currentIndex % 10 <= 10 - shipLength;
    } else {
      isFit = currentIndex <= 100 - (shipLength - 1) * 10 - 1;
    }

    if (isFit) {
      if (this.currentDirection === "horizontal") {
        for (let i = 0; i < shipLength; i++) {
          const nextIndex = currentIndex + i;
          const nextCell = this.gridItem[nextIndex];
          nextCell.classList.add("is-active");
        }
      } else {
        for (let i = 0; i < shipLength * 10; i += 10) {
          const nextIndex = currentIndex + i;
          const nextCell = this.gridItem[nextIndex];
          nextCell.classList.add("is-active");
        }
      }
    }
  }

  shipClickListener(e) {
    const currentIndex = Array.from(this.gridItem).indexOf(e.target);
    const playerBoard = this.game.playerOne.playerBoard;
    const shipLength = this.currentShip.size;
    let isFit = false;

    if (this.currentDirection === "horizontal") {
      isFit = currentIndex % 10 <= 10 - shipLength;
    } else {
      isFit = currentIndex <= 100 - (shipLength - 1) * 10 - 1;
    }

    const occupiedCells = [];
    if (this.currentDirection === "horizontal") {
      for (let i = 0; i < shipLength; i++) {
        const nextIndex = currentIndex + i;
        if (!playerBoard.isCellAvailable(nextIndex)) {
          occupiedCells.push(nextIndex);
        }
      }
    } else {
      for (let i = 0; i < shipLength * 10; i += 10) {
        const nextIndex = currentIndex + i;
        if (!playerBoard.isCellAvailable(nextIndex)) {
          occupiedCells.push(nextIndex);
        }
      }
    }

    if (isFit && occupiedCells.length === 0) {
      playerBoard.setShipOnBoard(this.currentShip, currentIndex);

      if (this.currentDirection === "horizontal") {
        for (let i = 0; i < shipLength; i++) {
          const nextIndex = currentIndex + i;
          const nextCell = this.gridItem[nextIndex];
          nextCell.classList.add("is-occupied");
          nextCell.classList.remove("is-active");
        }
      } else {
        for (let i = 0; i < shipLength * 10; i += 10) {
          const nextIndex = currentIndex + i;
          const nextCell = this.gridItem[nextIndex];
          nextCell.classList.add("is-occupied");
          nextCell.classList.remove("is-active");
        }
      }

      this.removeShipEventListeners(this.currentShip);
      this.placeNextShip();
    } else {
      console.log(
        `Unable to add ${this.currentShip.name} on cells ${occupiedCells}`
      );
    }
  }

  placeShipSequence() {
    this.shipHoverListener = this.shipHoverListener.bind(this);
    this.shipClickListener = this.shipClickListener.bind(this);
    this.mouseLeaveListener = this.mouseLeaveEventListener.bind(this);
    // add event listeners for ship placement
    this.gridItem.forEach((item) =>
      item.addEventListener("mouseenter", this.shipHoverListener)
    );
    this.gridItem.forEach((item) =>
      item.addEventListener("click", this.shipClickListener)
    );
    this.gridItem.forEach((item) =>
      item.addEventListener("mouseleave", this.mouseLeaveListener)
    );
  }

  removeShipEventListeners() {
    this.gridItem.forEach((item) =>
      item.removeEventListener("mouseenter", this.shipHoverListener)
    );
    this.gridItem.forEach((item) =>
      item.removeEventListener("click", this.shipClickListener)
    );
    this.gridItem.forEach((item) =>
      item.removeEventListener("mouseleave", this.mouseLeaveListener)
    );
  }

  placeNextShip() {
    console.log("here");
    console.log(this.fleet);
    if (this.fleet.length === 0) {
      // all ships have been placed
      // do something else, e.g. start the game
      console.log("All ships have been placed");
      this.togglePlayerBoard();
      this.startGame();
    } else {
      this.currentShip = this.fleet.shift();
      console.log("next ship: ", this.currentShip);
      this.placeShipSequence();
    }
  }

  playTurn() {
    if (this.playerTurn === true) {
      this.playerPlay(() => {
        if (
          !this.game.playerOne.playerBoard.checkSunk() &&
          !this.game.computer.playerBoard.checkSunk()
        ) {
          this.instruction.textContent = "Computer's turn...";
          setTimeout(() => {
            this.playerTurn = false;
            this.playTurn();
          }, 1000);
        } else {
          this.endGame();
        }
      });
    } else if (this.playerTurn === false) {
      this.computerPlay(() => {
        if (
          !this.game.playerOne.playerBoard.checkSunk() &&
          !this.game.computer.playerBoard.checkSunk()
        ) {
          this.instruction.textContent = `${this.game.playerOne.name}'s turn...`;
          setTimeout(() => {
            this.playerTurn = true;
            this.playTurn();
          }, 1000);
        } else {
          this.endGame();
        }
      });
    }
  }

  playerPlay(callback) {
    const listener = (e) => {
      const currentIndex = Array.from(this.playerGrid).indexOf(e.target);

      // Check if the cell has already been attacked
      if (this.game.computer.playerBoard.checkAttack(currentIndex) === true) {
        return;
      }

      let result = this.game.computer.playerBoard.receiveAttack(currentIndex);
      if (result === "success") {
        this.playerGrid[currentIndex].classList.add("is-hit");
        this.playerGrid[currentIndex].textContent = "O";
      } else {
        this.playerGrid[currentIndex].classList.add("is-missed");
        this.playerGrid[currentIndex].textContent = "X";
      }
      this.playerGrid.forEach((item) =>
        item.removeEventListener("click", listener)
      );
      callback();
    };
    this.playerGrid.forEach((item) => item.addEventListener("click", listener));
  }

  computerPlay(callback) {
    let currentIndex = this.game.computer.getRandomCell();
    while (
      this.game.playerOne.playerBoard.attackedCells.includes(currentIndex)
    ) {
      currentIndex = this.game.computer.getRandomCell();
    }
    const result = this.game.playerOne.playerBoard.receiveAttack(currentIndex);
    if (result === "success") {
      this.computerGrid[currentIndex].classList.add("is-hit");
      this.computerGrid[currentIndex].textContent = "O";
    } else {
      this.computerGrid[currentIndex].classList.add("is-missed");
      this.computerGrid[currentIndex].textContent = "X";
    }
    callback();
  }

  endGame() {
    if (this.game.playerOne.playerBoard.checkSunk()) {
      this.instruction.textContent = "You lost!";
      alert(`YOU LOST!!! LMAO`);
    } else if (this.game.computer.playerBoard.checkSunk()) {
      this.instruction.textContent = `${this.game.playerOne.name} won!`;
      alert(`${this.game.playerOne.name} won!`);
    }
  }

  mouseLeaveEventListener() {
    // Remove the "highlight" class from all cells when the mouse leaves
    this.gridItem.forEach((item) => item.classList.remove("is-active"));
  }

  togglePlayerBoard() {
    this.playerBoard.classList.toggle("hide");
    this.currentDirectionDiv.classList.toggle("hide");
  }

  isActive(e) {
    const currentCell = e.target;
    currentCell.classList.add("is-active");
  }

  notActive(e) {
    const currentCell = e.target;
    currentCell.classList.remove("is-active");
  }

  activeCells() {
    this.playerGrid.forEach((item) =>
      item.addEventListener("mouseenter", this.isActive)
    );
    this.playerGrid.forEach((item) =>
      item.addEventListener("mouseleave", this.notActive)
    );
  }

  toggleActive() {
    this.gridItem.forEach((item) => item.classList.toggle("is-active"));
  }

  updateDirection() {
    this.currentDirectionSelector.textContent = this.getCurrentDirection(
      this.mainPlayer
    );
    this.currentDirection = this.getCurrentDirection(this.mainPlayer);
    return this.getCurrentDirection(this.mainPlayer);
  }

  getCurrentDirection() {
    return this.game.playerOne.getPlayerBoard().currentDirection;
  }

  switchCurrentDirection() {
    let playerBoard = this.game.playerOne.getPlayerBoard();
    playerBoard.switchCurrentDirection();
    this.currentDirectionSelector.textContent = this.getCurrentDirection();
    this.updateDirection();
    return playerBoard.getCurrentDirection();
  }

  toggleForm() {
    this.form.classList.toggle("hide");
  }

  toggleGrid() {
    this.positioningBoard.classList.toggle("hide");
    this.currentDirectionDiv.classList.toggle("hide");
  }
}

function initGame() {
  let newBoard = new BoardView();
  return newBoard;
}

export { initGame };
