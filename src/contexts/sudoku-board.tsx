import React, {createContext, FC, ReactElement, ReactNode, useContext, useEffect, useState} from "react";
import Cell from "../puzzle/cell";

type BoardArray = Array<Array<Cell>>;
class Board {
    board: BoardArray;

    constructor(initializer: BoardArray | null = null) {
        if (initializer) {
            this.board = initializer;
            return;
        }

        this.board = [];
        for (let i = 0; i < 9; i++) {
            this.board[i] = [];
            for (let j = 0; j < 9; j++) {
                this.board[i][j] = new Cell();
            }
        }
    }

    get rows() {
        return this.board;
    }

    setCell(row: number, column: number, value: number) {

    }
}

interface BoardContextInterface {
    puzzle: Board;
    reset: Function;
    setCell: Function;
}

const BoardContext = createContext<BoardContextInterface | null>(null);

export const useSudokuBoardContext = () => useContext(BoardContext);

export const SudokuBoardProvider = ({children}: {children: ReactNode}) => {
    const [puzzle, setPuzzle] = useState(new Board());

    // useEffect(() => {
    //     axios.
    // }, []);

    return (
        <BoardContext.Provider
            value={{
                puzzle,
                reset: () => setPuzzle(new Board()),
                setCell: (row: number, column: number, value: number) => puzzle.setCell(row, column, value)
            }}
        >
            {children}
        </BoardContext.Provider>
    );
};
