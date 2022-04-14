import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import Cell from "../puzzle/cell";
import axios from "axios";

type BoardArray = Array<Array<Cell>>;
class Board {
    #columns: BoardArray;
    #rows: BoardArray;
    #index: any;

    constructor(initializer: any = {}) {
        if (initializer instanceof Board) {
            this.#rows = initializer.rows;
            this.#index = initializer.cells;
            this.#columns = initializer.columns;
            return;
        }

        this.#index = {};
        this.#rows = [];
        this.#columns = [];
        for (let i = 0; i < 9; i++) {
            this.#rows[i] = [];
            for (let j = 0; j < 9; j++) {
                this.#columns[j] ||= [];
                const coord = Cell.xyToID(i, j);
                this.#index[coord] = this.#rows[i][j] = this.#columns[j][i] = new Cell(coord);
            }
        }

        for(const [id, value] of Object.entries(initializer)) {
            this.setCell(id, value, true);
        }
    }

    clear() {
        for(const cell of Object.values<Cell>(this.#index)) {
            if (!cell.immutable) {
                cell.value = null;
            }
        }
        return this.clone();
    }

    clone() {
        return new Board(this);
    }

    get cells() {
        return this.#index;
    }

    get columns() {
        return this.#columns;
    }

    get rows() {
        return this.#rows;
    }

    setCell(id: string, value: any, immutable: boolean = false) {
        this.#index[id].immutable = immutable;
        this.#index[id].value = value;
        return this.clone();
    }
}

interface BoardContextInterface {
    difficulty: string;
    puzzle: Board;
    newPuzzle: Function;
    reset: Function;
    setCell: Function;
    setDifficulty: Function;
}

const BoardContext = createContext<BoardContextInterface | null>(null);

export const useSudokuBoardContext = () => useContext(BoardContext);

export const SudokuBoardProvider = ({children}: {children: ReactNode}) => {
    const [puzzle, setPuzzle] = useState(new Board());
    const [difficulty, setDifficulty] = useState("medium");

    const renewPuzzle = (difficulty: string) => {
        axios.get(`https://vast-chamber-17969.herokuapp.com/generate?difficulty=${difficulty}`)
            .then(result => {
                setDifficulty(result.data.difficulty);
                setPuzzle(new Board(result.data.puzzle));
            });
    };

    useEffect(() => renewPuzzle("random"), []);

    return (
        <BoardContext.Provider
            value={{
                difficulty,
                puzzle,
                newPuzzle: () => renewPuzzle(difficulty),
                reset: () => setPuzzle(puzzle.clear()),
                setCell: (id: string, value: number) => setPuzzle(puzzle.setCell(id, value)),
                setDifficulty
            }}
        >
            {children}
        </BoardContext.Provider>
    );
};
