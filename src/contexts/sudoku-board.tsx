import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import Board from "../puzzle/board";
import axios from "axios";

interface BoardContextInterface {
    difficulty: string;
    puzzle: Board;
    newPuzzle: Function;
    reset: Function;
    setCell: Function;
    solve: Function;
    validate: Function;
}

const defaultBoardContext = {
    difficulty: "random",
    puzzle: new Board(),
    newPuzzle: () => {},
    reset: () => {},
    setCell: () => {},
    solve: () => {},
    validate: () => {},
};

const BoardContext = createContext<BoardContextInterface>(defaultBoardContext);

export const useSudokuBoardContext = () => useContext(BoardContext);

const difficulties = ["easy", "medium", "hard"];

const renewPuzzle = (difficulty: string, setDifficulty: Function, setPuzzle: Function) => {
    if (difficulty === "random") {
        difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    }
    axios.get(`https://vast-chamber-17969.herokuapp.com/generate?difficulty=${difficulty}`)
        .then(result => {
            setDifficulty(result.data.difficulty);
            setPuzzle(new Board(result.data.puzzle));
        });
};

const solvePuzzle = (puzzle: Board, setPuzzle: Function) => {
    setPuzzle(puzzle.solve());
};

const validatePuzzle = (doIt: boolean, puzzle: Board, setPuzzle: Function) => {
    setPuzzle(puzzle.validate(doIt));
};

export const SudokuBoardProvider = ({children}: {children: ReactNode}) => {
    const [puzzle, setPuzzle] = useState(new Board());
    const [difficulty, setDifficulty] = useState(defaultBoardContext.difficulty);

    useEffect(() => renewPuzzle(difficulty, setDifficulty, setPuzzle), []);

    return (
        <BoardContext.Provider
            value={{
                difficulty,
                puzzle,
                newPuzzle: (difficulty: string) => renewPuzzle(difficulty, setDifficulty, setPuzzle),
                reset: () => setPuzzle(puzzle.clear()),
                setCell: (id: string, value: number) => setPuzzle(puzzle.setCell(id, value)),
                solve: () => solvePuzzle(puzzle, setPuzzle),
                validate: (doIt: boolean) => validatePuzzle(doIt, puzzle, setPuzzle),
            }}
        >
            {children}
        </BoardContext.Provider>
    );
};
