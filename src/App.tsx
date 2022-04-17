import React from 'react';
import './App.css';
import {
    Grid,
    Link,
    Typography
} from "@mui/material";
import {SudokuBoardProvider} from "./contexts/sudoku";
import fx from 'fireworks';
import SudokuBoard from "./components/sudoku/board";

const launchFireworks = (n: number) => {
    const range = (n: number) => [...new Array(n)]
    range(n).map(() =>
        fx({
            x: Math.random() * window.innerWidth / 2 + window.innerWidth / 8,
            y: Math.random() * window.innerWidth / 2 + window.innerWidth / 8,
            colors: ['#cc3333', '#ecde60', '#213ec1', '#82e152', '#9752e1'],
        })
    )
};

const App = () => (
    <SudokuBoardProvider>
        <Grid container justifyContent="center" alignItems="center" className="App">
            <Grid item>
                <Grid container direction="column" spacing={2}>
                    <Grid item xs>
                        <Typography variant="h2" className="App-header">
                            Sudoku!
                        </Typography>
                    </Grid>
                    <Grid item>
                        <SudokuBoard onSolve={() => launchFireworks(6)}></SudokuBoard>
                    </Grid>
                    <Grid item container justifyContent="right">
                        <Grid item xs={3}>
                        <Link
                            onMouseEnter={() => launchFireworks(16)}
                            target="_blank" rel="noopener"
                            href="https://docs.google.com/document/d/1O1HbMJgIAVcBQXBuCiXEo847x3lTTaZ7BWDAhxypDmk"
                        >by Derek Price</Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </SudokuBoardProvider>
);


export default App;
