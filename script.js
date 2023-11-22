"use strict";

class TicTacToe {
  constructor() {
    this.activePlayer = null;
    this.player1 = document.querySelector(".player-1");
    this.player2 = document.querySelector(".player-2");
    this.tie = document.querySelector(".player-tie");
    this.message = document.querySelector(".user-message");
    this.blocks = document.querySelectorAll(".block");
    this.reset = document.querySelector(".reset");
    this.reset.addEventListener("click", this.resetBoard);
    this.boundHandleClick = this.handleClick.bind(this);
    this.boardValues = new Array(9).fill(0);
    this.playerDict = {
      1: "X",
      2: "O",
    };
    this.winningCombinations = [
      // down
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // across
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // diagonal
      [0, 4, 8],
      [2, 4, 6],
    ];
  }

  updateTurn = () => {
    // highlight whose turn it is
    (this.activePlayer === 1 ? this.player1 : this.player2).classList.add(
      "active"
    );
    (this.activePlayer === 1 ? this.player2 : this.player1).classList.remove(
      "active"
    );
  };

  incrementScores = (player = this.activePlayer) => {
    // update the scoreboard for the outcome of the game
    const scorer = Number.isInteger(player) ? `player-${player}` : `tie`;
    document.getElementById(scorer).innerHTML++;
  };

  updateUserMessage = (player = this.activePlayer) => {
    const newMessage = Number.isInteger(player)
      ? `Player ${player} has won!`
      : `It's a tie!`;
    this.message.innerHTML = newMessage;
  };

  updateBackend = (block) => (this.boardValues[block] = this.activePlayer);

  updateFrontend = (block) =>
    (document.getElementById(block).innerHTML =
      this.playerDict[this.activePlayer]);

  buildPlayerBlocks = (player) => {
    return this.boardValues
      .map((element, index) => (element === player ? index : -1))
      .filter((index) => index !== -1);
  };

  applyWinnerClass = (winningBlocks) => {
    winningBlocks.forEach((block) =>
      document.getElementById(block).classList.add("winner")
    );
  };

  checkForWinner = () => {
    const playerIndices = [...this.buildPlayerBlocks(this.activePlayer)];
    if (playerIndices.length < 3) return false;

    for (const combination of this.winningCombinations) {
      if (combination.every((number) => playerIndices.includes(number))) {
        this.applyWinnerClass(combination);
        return true;
      }
    }
    return false;
  };

  disableBlocks = () =>
    this.blocks.forEach((block) => {
      block.removeEventListener("click", this.boundHandleClick);
    });

  updateGameboard = (block) => {
    this.updateBackend(block);
    this.updateFrontend(block);

    if (this.checkForWinner()) {
      this.incrementScores();
      this.updateUserMessage();
      this.disableBlocks();
    } else {
      const openMoves = this.boardValues.includes(0);
      if (openMoves) {
        this.activePlayer = this.activePlayer === 1 ? 2 : 1;
        this.updateTurn();
      } else {
        console.log("board is full...its a tie");
        this.incrementScores("tie");
        this.updateUserMessage("tie");
        this.disableBlocks();
      }
    }
  };

  handleClick(e) {
    this.logMove(e);
  }

  logMove = function (e) {
    const blockId = e.target.id;
    this.validateMove(blockId)
      ? this.updateGameboard(blockId)
      : alert("Pick a different box...");
  };

  validateMove = (blockId) => (!this.boardValues[blockId] ? true : false);

  resetBoard = () => {
    // randomly select which player picks first
    this.activePlayer = Math.round(Math.random()) + 1;
    // console.log(`${this.activePlayer} starts as active player`);
    this.updateTurn();
    // clean blocks state
    this.blocks.forEach((block) => {
      block.innerHTML = "";
      block.classList.remove("winner");
      block.addEventListener("click", this.boundHandleClick);
    });
    // reset board values
    this.boardValues = Array(9).fill(0);
    // reset message
    this.message.innerHTML = "Play";
  };
}

const game = new TicTacToe();
game.resetBoard();
