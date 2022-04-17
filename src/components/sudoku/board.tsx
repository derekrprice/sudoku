import {useSudokuBoardContext} from "../../contexts/sudoku-board";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import Row from "./row";

/**
 * Don't show the true board status unless validation is enabled.
 * @param doValidate
 * @param status
 */
const getStatus = (doValidate: Boolean, status: String) =>
    !doValidate && status !== "solved" ? "unsolved" : status;

const Board = ({onSolve}: {onSolve: Function}) => {
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
        validate(event.target.checked);
        setDoValidate(event.target.checked);
    };

    useEffect(() => {
        if (puzzle.status != "solved") {
            return;
        }
        onSolve();
    }, [puzzle.status]);

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
                        <InputLabel shrink sx={{color: "white"}}>Validate</InputLabel>
                        <FormControlLabel
                            control={<Checkbox
                                checked={doValidate}
                                onChange={handleValidateClick}
                                checkedIcon={<GavelIcon sx={{color: "white"}} />}
                                icon={<GavelIcon color="primary" />}
                                sx={{border: "1px solid white", "border-radius": "4px", ...(doValidate ? {"background-color": "#1976d2"} : {})}}
                            />}
                            label={getStatus(doValidate, puzzle.status)}
                            sx={{color: doValidate ? "white" : "#555555", "margin-left": 0, "& span": {"margin-left": "10px"}}}
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