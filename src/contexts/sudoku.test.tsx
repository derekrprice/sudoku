import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {SudokuBoardProvider, useSudokuBoardContext} from "./sudoku";
import {rest} from "msw";
import {setupServer} from "msw/node";
import {mediumBoard} from "../components/sudoku/__testdata__/sample-boards";

const server = setupServer(
    rest.get("https://vast-chamber-17969.herokuapp.com/generate",
        (req, res, ctx) =>
            res(ctx.json(mediumBoard))
    )
);

beforeAll(() => server.listen({
    onUnhandledRequest: 'error'
}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const DummyConsumer: React.FC = () => {
    const {difficulty} = useSudokuBoardContext();
    return <div>{difficulty}</div>;
};

it("loads the puzzle and reports difficulty", async () => {
    render(<SudokuBoardProvider><DummyConsumer></DummyConsumer></SudokuBoardProvider>);
    const difficulty = await waitFor(() => screen.getByText("medium"));
    expect(difficulty).toBeInTheDocument();
});