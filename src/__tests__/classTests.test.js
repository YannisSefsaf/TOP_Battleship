import { Game, Player, Computer, Board } from "../models.js";

describe("Battleship Game", () => {
  let newGame;

  beforeEach(() => {
    let mainPlayer = new Player("Ako");
    newGame = new Game(mainPlayer);
  });

  describe("initialize", () => {
    test("should initialize the newGame with the correct number of ships for the computer", () => {
      expect(newGame.computer.fleet.length).toBe(5);
    });

    test("should initialize the newGame with the correct players", () => {
      expect(newGame.playerOne).toBeDefined();
      expect(newGame.computer).toBeDefined();
    });
  });
});

describe("place ship", () => {
  let newGame;

  beforeEach(() => {
    let mainPlayer = new Player("Ako");
    newGame = new Game(mainPlayer);
  });

  test("ship not fit horizontally", () => {
    const logSpy = jest.spyOn(global.console, "log");
    newGame.playerOne.playerBoard.setShipOnBoard(newGame.playerOne.carrier, 6);
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.battleship,
      7
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.destroyer,
      8
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.submarine,
      8
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.patrolBoat,
      9
    );
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(5);
    expect(logSpy).toHaveBeenCalledWith("Boat not fit!");
  });

  test("ship not fit vertically", () => {
    const logSpy = jest.spyOn(global.console, "log");
    newGame.playerOne.playerBoard.setCurrentDirection("vertical");
    newGame.playerOne.playerBoard.setShipOnBoard(newGame.playerOne.carrier, 60);
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.battleship,
      70
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.destroyer,
      80
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.submarine,
      80
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.patrolBoat,
      90
    );
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(10);
    expect(logSpy).toHaveBeenCalledWith("Boat not fit!");
  });

  test("can't set same ship twice", () => {
    const logSpy = jest.spyOn(global.console, "log");
    newGame.playerOne.playerBoard.setShipOnBoard(newGame.playerOne.carrier, 0);
    newGame.playerOne.playerBoard.setShipOnBoard(newGame.playerOne.carrier, 10);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(11);
    expect(logSpy).toHaveBeenCalledWith("Boat already set!");
  });

  test("can't set same ship on already occupied cells", () => {
    const logSpy = jest.spyOn(global.console, "log");
    newGame.playerOne.playerBoard.setShipOnBoard(newGame.playerOne.carrier, 5);
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.battleship,
      3
    );
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(12);
    expect(logSpy).toHaveBeenCalledWith(
      `Unable to add boat Battleship as the cells are already occupied`
    );
  });

  test("should place a ship on the board horizontally", () => {
    newGame.playerOne.playerBoard.setCurrentDirection("horizontal");
    newGame.playerOne.playerBoard.setShipOnBoard(newGame.playerOne.carrier, 0);
    expect(newGame.playerOne.playerBoard.board[0]).toBe("Carrier");
    expect(newGame.playerOne.playerBoard.board[1]).toBe("Carrier");
    expect(newGame.playerOne.playerBoard.board[2]).toBe("Carrier");
    expect(newGame.playerOne.playerBoard.board[3]).toBe("Carrier");
    expect(newGame.playerOne.playerBoard.board[4]).toBe("Carrier");
    expect(newGame.playerOne.playerBoard.board[5]).toBeNull();
  });

  test("should place a ship on the board vertically", () => {
    newGame.playerOne.playerBoard.setCurrentDirection("vertical");
    newGame.playerOne.playerBoard.setShipOnBoard(newGame.playerOne.carrier, 0);
    expect(newGame.playerOne.playerBoard.board[0]).toBe("Carrier");
    expect(newGame.playerOne.playerBoard.board[10]).toBe("Carrier");
    expect(newGame.playerOne.playerBoard.board[20]).toBe("Carrier");
    expect(newGame.playerOne.playerBoard.board[30]).toBe("Carrier");
    expect(newGame.playerOne.playerBoard.board[40]).toBe("Carrier");
    expect(newGame.playerOne.playerBoard.board[50]).toBeNull();
  });
});

describe("check all ships set computer", () => {
  let newGame;

  beforeEach(() => {
    let mainPlayer = new Player("Ako");
    newGame = new Game(mainPlayer);
  });

  test("should return true", () => {
    expect(newGame.computer.checkSet()).toBe(true);
  });
});

describe("check all ships set player", () => {
  let newGame;

  beforeEach(() => {
    let mainPlayer = new Player("Ako");
    newGame = new Game(mainPlayer);
  });

  test("should return true", () => {
    newGame.playerOne.playerBoard.setShipOnBoard(newGame.playerOne.carrier, 0);
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.battleship,
      10
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.destroyer,
      20
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.submarine,
      30
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.patrolBoat,
      40
    );
    expect(newGame.playerOne.checkSet()).toBe(true);
  });

  test("should return false", () => {
    newGame.playerOne.playerBoard.setShipOnBoard(newGame.playerOne.carrier, 0);
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.battleship,
      10
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.destroyer,
      20
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.submarine,
      30
    );
    console.log(newGame.playerOne.patrolBoat.isSet);
    expect(newGame.playerOne.checkSet()).toBe(false);
  });
});

describe("attack", () => {
  let newGame;

  beforeEach(() => {
    let mainPlayer = new Player("Ako");
    newGame = new Game(mainPlayer);
    newGame.playerOne.playerBoard.setShipOnBoard(newGame.playerOne.carrier, 0);
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.battleship,
      10
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.destroyer,
      20
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.submarine,
      30
    );
    newGame.playerOne.playerBoard.setShipOnBoard(
      newGame.playerOne.patrolBoat,
      40
    );
  });

  test("sink boat", () => {
    newGame.playerOne.playerBoard.receiveAttack(0);
    newGame.playerOne.playerBoard.receiveAttack(1);
    newGame.playerOne.playerBoard.receiveAttack(2);
    newGame.playerOne.playerBoard.receiveAttack(3);
    newGame.playerOne.playerBoard.receiveAttack(4);
    expect(newGame.playerOne.carrier.isSunk).toBe(true);
  });

  test("sink all boats", () => {
    newGame.playerOne.playerBoard.receiveAttack(0);
    newGame.playerOne.playerBoard.receiveAttack(1);
    newGame.playerOne.playerBoard.receiveAttack(2);
    newGame.playerOne.playerBoard.receiveAttack(3);
    newGame.playerOne.playerBoard.receiveAttack(4);
    newGame.playerOne.playerBoard.receiveAttack(10);
    newGame.playerOne.playerBoard.receiveAttack(11);
    newGame.playerOne.playerBoard.receiveAttack(12);
    newGame.playerOne.playerBoard.receiveAttack(13);
    newGame.playerOne.playerBoard.receiveAttack(20);
    newGame.playerOne.playerBoard.receiveAttack(21);
    newGame.playerOne.playerBoard.receiveAttack(22);
    newGame.playerOne.playerBoard.receiveAttack(30);
    newGame.playerOne.playerBoard.receiveAttack(31);
    newGame.playerOne.playerBoard.receiveAttack(32);
    newGame.playerOne.playerBoard.receiveAttack(40);
    newGame.playerOne.playerBoard.receiveAttack(41);
    expect(newGame.playerOne.playerBoard.checkSunk()).toBe(true);
  });

  test("should add cell to attackedCells array", () => {
    newGame.playerOne.playerBoard.receiveAttack(70);
    expect(newGame.playerOne.playerBoard.attackedCells).toContain(70);
  });

  test("should register an attack on the board", () => {
    expect(newGame.playerOne.playerBoard.receiveAttack(0)).toBe("success");
  });

  test("should register a miss on the board", () => {
    expect(newGame.playerOne.playerBoard.receiveAttack(9)).toBe("empty");
  });

  test("can't attack same cell twice", () => {
    newGame.playerOne.playerBoard.receiveAttack(9);
    expect(newGame.playerOne.playerBoard.receiveAttack(9)).toBe(
      "already-attacked"
    );
  });
});
