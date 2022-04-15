import React, {ChangeEvent, KeyboardEvent, useEffect, useState} from 'react';
import './App.css';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem, Popover,
    Select,
    Typography
} from "@mui/material";
import {SudokuBoardProvider, useSudokuBoardContext} from "./contexts/sudoku-board";
import Cell from "./puzzle/cell";
import GavelIcon from "@mui/icons-material/Gavel";
import fx from 'fireworks'

const SudokuRow = ({idx, row, setCell, doValidate, validate }: {idx: string, row: Array<Cell>, setCell: Function, doValidate: boolean, validate: Function }) => {
    const handleKeyPress = (cell: Cell, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Tab") {
            return;
        }

        if (["Backspace", "Delete", "0"].includes(event.key)) {
            setCell(cell.id, null);
        } else {
            const newValue = parseInt(event.key);
            if (!newValue) {
                event.preventDefault();
                return;
            }
            setCell(cell.id, newValue);
        }

        validate(doValidate);
    };

    const cells = row.map(cell => (
        <td key={cell.id} className={cell.immutable ? 'given' : cell.broken ? "broken" : 'editable'}>
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
    const { difficulty, puzzle, reset, newPuzzle, setCell, solve, validate } = useSudokuBoardContext();
    const [doValidate, setDoValidate] = useState<boolean>(false);

    const rows = puzzle.rows.map((row, i) => (
        <SudokuRow
            idx={`${i}`}
            key={`${i}`}
            row={row}
            setCell={setCell}
            {...{doValidate, validate}}
        />
    ));

    const handleValidateClick = (event: ChangeEvent<HTMLInputElement>) => {
        validate(event.target.checked);
        setDoValidate(event.target.checked);
    };

    useEffect(() => {
        const range = (n: number) => [...new Array(n)]
        if (puzzle.status != "solved") {
            return;
        }

        range(19).map(() =>
            fx({
                x: Math.random() * window.innerWidth / 2 + window.innerWidth / 8,
                y: Math.random() * window.innerWidth / 2 + window.innerWidth / 8,
                colors: ['#cc3333', '#ecde60', '#213ec1', '#82e152', '#9752e1'],
            })
        )
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
                                label={puzzle.status}
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

function App() {
    const [jokeAnchor, setJokeAnchor] = useState<HTMLElement | null>(null);
    const handleJokeOpen = (event: React.MouseEvent<HTMLElement>) => setJokeAnchor(event.currentTarget);
    const handleJokeClose = () => setJokeAnchor(null);

    return (
        <SudokuBoardProvider>
            <Grid container justifyContent="center" alignItems="center" className="App">
                <Grid item>
                    <Grid container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography variant="h2" onMouseEnter={handleJokeOpen} onMouseLeave={handleJokeClose} className="App-header">
                                Sudoku!
                            </Typography>
                            <Popover
                                open={!!jokeAnchor}
                                anchorEl={jokeAnchor}
                                sx={{pointerEvents: 'none',}}
                                anchorOrigin={{vertical: 'top', horizontal: 'left',}}
                                transformOrigin={{vertical: 'bottom', horizontal: 'left',}}
                                onClose={handleJokeClose}
                                disableRestoreFocus
                            >
                                <Typography id="Joke" variant="body1">
                                    The guy who invented Sudoku actually really hated numbers.
                                </Typography>
                                <Typography id="Punchline" variant="body2">
                                    He just wanted to put them in their place.
                                </Typography>
                            </Popover>
                        </Grid>
                        <Grid item>
                            <SudokuBoard></SudokuBoard>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </SudokuBoardProvider>
    );
}

export default App;
