import React, {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
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

export const SudokuBoardProvider = ({children}: {children: ReactNode}) => {
    const [puzzle, setPuzzle] = useState(new Puzzle());
    const [difficulty, setDifficulty] = useState(defaultBoardContext.difficulty);

    useEffect(() => renewPuzzle(difficulty, setDifficulty, setPuzzle), []);

    const newPuzzle = useCallback((newDifficulty: string = difficulty) => renewPuzzle(newDifficulty, setDifficulty, setPuzzle), [puzzle, setPuzzle]);
    const reset = useCallback(() => setPuzzle(puzzle.clone().clear()), [puzzle, setPuzzle]);
    const setCell = useCallback((id: string, value: number) => setPuzzle(puzzle.clone().setCell(id, value)), [puzzle, setPuzzle]);
    const solve = useCallback(() => setPuzzle(puzzle.clone().solve()), [puzzle, setPuzzle]);
    const validate = useCallback(() => setPuzzle(puzzle.clone().validate()), [puzzle, setPuzzle]);

    return (
        <BoardContext.Provider
            value={{
                difficulty,
                puzzle,
                newPuzzle,
                reset,
                setCell,
                solve,
                validate,
            }}
        >
            {children}
        </BoardContext.Provider>
    );
};
