import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import Puzzle from "../puzzle/puzzle";
import axios from "axios";

interface BoardContextInterface {
    difficulty: string;
    puzzle: Puzzle;
    newPuzzle: Function;
    reset: Function;
    setCell: Function;
    solve: Function;
    validate: Function;
}

const defaultBoardContext = {
    difficulty: "random",
    puzzle: new Puzzle(),
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
            setPuzzle(new Puzzle(result.data.puzzle));
        });
};

const solvePuzzle = (puzzle: Puzzle, setPuzzle: Function) => {
    setPuzzle(puzzle.solve());
};

const validatePuzzle = (doIt: boolean, puzzle: Puzzle, setPuzzle: Function) => {
    setPuzzle(puzzle.validate());
};

export const SudokuBoardProvider = ({children}: {children: ReactNode}) => {
    const [puzzle, setPuzzle] = useState(new Puzzle());
    const [difficulty, setDifficulty] = useState(defaultBoardContext.difficulty);

    useEffect(() => renewPuzzle(difficulty, setDifficulty, setPuzzle), []);

    return (
        <BoardContext.Provider
            value={{
                difficulty,
                puzzle,
                newPuzzle: (newDifficulty: string = difficulty) => renewPuzzle(newDifficulty, setDifficulty, setPuzzle),
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
