import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=5, ncols=7, chanceLightStartsOn=0.4 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      const newRow = [];
      for (let i = 0; i < ncols; i++) {
        const newCell = (Math.random() <= chanceLightStartsOn)
        newRow.push(newCell);
      }
      initialBoard.push(newRow)
    }
    return initialBoard;
  }

  function hasWon() {
    for (const row of board) {
      for (const cell of row) {
        if (cell) {
          return false
        }
        // TODO: check the board in state to determine whether the player has won.
      }
    }
    return true
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      //Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map(row => [...row])

      //in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy)
      flipCell(y-1, x, boardCopy)
      flipCell(y+1, x, boardCopy)
      flipCell(y, x-1, boardCopy)
      flipCell(y, x+1, boardCopy)

      return boardCopy
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if(hasWon()){
    return (<h2>Congratulations! You've turned of all of the lights</h2>)
  }

  // make table board
  return (
  <table className="Board">
    <tbody>
      {board.map((row, y) => 
        <tr key={`row${y}`}>
          {row.map((cell, x) => 
            <Cell key={`${y}-${x}`} flipCellsAroundMe={evt => flipCellsAround(`${y}-${x}`)} isLit={cell}/>
          )}
        </tr>
      )}
    </tbody>
  </table>)
}

export default Board;
