import {useSudokuBoardContext} from "../../contexts/sudoku";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import Row from "./row";

/**
 * Don't show the true board status unless validation is enabled.
 * @param doValidate
 * @param status
 */
const getStatus = (doValidate: Boolean, status: string) =>
    !doValidate && !["solved", "unsolvable"].includes(status) ? "unsolved" : status;

interface BoardProps {
    onSolve?: Function;
}

const Board: React.FC<BoardProps> = ({onSolve}) => {
    const { difficulty, puzzle, reset, newPuzzle, setCell, solve, validate } = useSudokuBoardContext();
    const [doValidate, setDoValidate] = useState<boolean>(false);

    const rows = puzzle.rows.map((row, i) => (
        <Row
            idx={`${i}`}
            key={`${i}`}
            {...{doValidate, row, setCell, validate}}
        />
    ));

    const handleValidateClick = (event: ChangeEvent<HTMLInputElement>) => {
        setDoValidate(event.target.checked);
    };

    useEffect(() => {
        if (puzzle.status !== "solved") {
            return;
        }
        if (onSolve) {
            onSolve();
        }
    }, [puzzle.status, onSolve]);

    return (
        <Grid container justifyContent="center" spacing={1}>
            <Grid item xs={12} sm={8}>
                <table className="sudokuBoard">
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <FormControl fullWidth>
                            <InputLabel sx={{color: "white"}}>Difficulty</InputLabel>
                            <Select variant="filled" sx={{color: "white"}}
                                    value={difficulty}
                                    label="Difficulty"
                                    onChange={(event) => newPuzzle(event.target.value)}
                            >
                                <MenuItem value="easy">Easy</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="hard">Hard</MenuItem>
                                <MenuItem value="random">Random</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <InputLabel sx={{color: "white", "transform": "translate(14px, -4px) scale(0.75)"}}>Validate</InputLabel>
                        <FormControlLabel
                            control={<Checkbox
                                checked={doValidate}
                                onChange={handleValidateClick}
                                sx={{color: "white"}}
                            />}
                            label={getStatus(doValidate, puzzle.status)}
                            sx={{color: doValidate ? "white" : "#555555", "marginLeft": "-23px", height: "1.2em", "& span": {"marginLeft": "10px"}}}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={() => newPuzzle()}>New Puzzle</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={() => reset()}>Clear Guesses</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={() => solve()}>Solve it!</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default Board;