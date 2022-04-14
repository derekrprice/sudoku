import React, {KeyboardEvent} from 'react';
import './App.css';
import {Button} from "@mui/material";
import {SudokuBoardProvider, useSudokuBoardContext} from "./contexts/sudoku-board";
import Cell from "./puzzle/cell";

const SudokuRow = ({idx, row, setCell}: {idx: string, row: Array<Cell>, setCell: Function}) => {
    const handleKeyPress = (cell: Cell, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Tab") {
            return;
        }
        const newValue = parseInt(event.key);
        if (!newValue) {
            event.preventDefault();
            return;
        }
        setCell(cell.id, newValue);
    };

    const cells = row.map(cell => (
        <td key={cell.id} className={cell.immutable ? 'given' : 'editable'}>
            <input type="text"
                   value={cell.value ?? ''}
                   disabled={cell.immutable}
                   onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => handleKeyPress(cell, event)}
                   onChange={() => {/*avoid a react warning*/}}
            />
        </td>
    ));

    return <tr key={idx}>{cells}</tr>;
};

const SudokuBoard = () => {
    const { puzzle, reset, newPuzzle, setCell } = useSudokuBoardContext();

    const rows = puzzle.rows.map((row, i) => (
        <SudokuRow idx={`${i}`} key={`${i}`} row={row} setCell={setCell}></SudokuRow>
    ));
    return (
        <>
            <table className="sudokuBoard">
                <tbody>
                    {rows}
                </tbody>
            </table>
            <Button variant="contained" onClick={reset}>Clear Guesses</Button>
            <Button variant="contained" onClick={newPuzzle}>New Puzzle</Button>
        </>
    )
};

function App() {
  return (
      <SudokuBoardProvider>
    <div className="App">
      <header className="App-header">
          Sudoku!
      </header>
            <SudokuBoard></SudokuBoard>
    </div>
      </SudokuBoardProvider>
  );
}

export default App;
