import React, {useState} from 'react';
import './App.css';
import {Box, Button, Grid, Grow, TextField} from "@mui/material";
import {SudokuBoardProvider, useSudokuBoardContext} from "./contexts/sudoku-board";
import Cell from "./puzzle/cell";

const SudokuRow = ({key, row, setCell}: {key: string, row: Array<Cell>, setCell: Function}) => {
    const handleCellChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCell(event.target.value);
    };

    const cells = row.map((cell, i) => (
        <td key={i}>
            <input type="text"
                onChange={handleCellChange}
            >{cell.value}</input>
        </td>
    ));

    return <tr key={key}>{cells}</tr>;
};

const SudokuBoard = () => {
    const { puzzle, reset, setCell } = useSudokuBoardContext();

  return (
      <>
          <table className="sudokuBoard">
              {puzzle.rows.map((row, i) => (<SudokuRow key={i} row={row} setCell={setCell}></SudokuRow>))}
          </table>
          <Button variant="contained">Reset</Button>
      </>
  )
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
          Sudoku!
      </header>
          <SudokuBoardProvider>
            <SudokuBoard></SudokuBoard>
          </SudokuBoardProvider>
    </div>
  );
}

export default App;
