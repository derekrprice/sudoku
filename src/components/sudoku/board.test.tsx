import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import Board from "./board";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {SudokuBoardProvider} from "../../contexts/sudoku";
import {hardBoard, hardSolution} from "./__testdata__/sample-boards";

describe("simple render tests", () => {
    it('renders the board', () => {
        render(<Board/>);
        const board = screen.getByRole("table");
        expect(board).toBeInTheDocument();
    });

    it('has 9 rows on the board', () => {
        render(<Board/>);
        const rows = screen.getAllByRole("row");
        expect(rows).toHaveLength(9);
    });

    it('has 81 cells on the board', () => {
        render(<Board/>);
        const cells = screen.getAllByRole("cell");
        expect(cells).toHaveLength(81);
    });

    it('has an input for each cell', () => {
        render(<Board/>);
        const editors = screen.getAllByRole("textbox");
        expect(editors).toHaveLength(81);
    });

    it('renders validation checkbox', () => {
        render(<Board/>);
        const checkbox = screen.getByRole("checkbox", {name: "unsolved"});
        expect(checkbox).toBeInTheDocument();
    });

    it('renders the difficulty dropdown', () => {
        render(<Board/>);
        const dropdown = screen.getByRole("button", {name: "Random"});
        expect(dropdown).toBeInTheDocument();
    });

    it('renders the new puzzle button', () => {
        render(<Board/>);
        const button = screen.getByRole("button", {name: "New Puzzle"});
        expect(button).toBeInTheDocument();
    });

    it('renders the clear button', () => {
        render(<Board/>);
        const button = screen.getByRole("button", {name: "Clear Guesses"});
        expect(button).toBeInTheDocument();
    });

    it('renders the solve button', () => {
        render(<Board/>);
        const button = screen.getByRole("button", {name: "Solve it!"});
        expect(button).toBeInTheDocument();
    });
});

describe("integration with API", () => {
    const server = setupServer(
        rest.get("https://vast-chamber-17969.herokuapp.com/generate",
            (req, res, ctx) =>
                res(ctx.json(hardBoard))
        )
    );

    beforeAll(() => server.listen({
        onUnhandledRequest: 'error'
    }))
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("renders a puzzle", async () => {

        render(<SudokuBoardProvider><Board></Board></SudokuBoardProvider>);

        const dropdown = await waitFor(() => screen.getByRole("button", {name: "Hard"}));
        expect(dropdown).toBeInTheDocument();

        for(const [key, value] of Object.entries(hardBoard.puzzle)) {
            const cell = screen.getByRole("textbox", {name: key});
            expect(cell.getAttribute("value")).toBe(value);
        }

        for(const key of Object.keys(hardSolution)) {
            const cell = screen.getByRole("textbox", {name: key});
            expect(cell.getAttribute("value")).toBe("");
        }
    });

    it("solves a puzzle", async () => {
        server.use(
            rest.get("https://vast-chamber-17969.herokuapp.com/generate",
                (req, res, ctx) =>
                    res(ctx.json(hardBoard))
            )
        );
        render(<SudokuBoardProvider><Board></Board></SudokuBoardProvider>);

        const dropdown = await waitFor(() => screen.getByRole("button", {name: "Hard"}));
        expect(dropdown).toBeInTheDocument();

        fireEvent.click(screen.getByText("Solve it!"));
        await waitFor(() => screen.getByText("solved"));

        for(const [key, value] of Object.entries(hardSolution)) {
            const cell = screen.getByRole("textbox", {name: key});
            expect(cell.getAttribute("value")).toBe(value);
        }
    });

    it("reports an unsolvable puzzle", async () => {
        server.use(
            rest.get("https://vast-chamber-17969.herokuapp.com/generate",
                (req, res, ctx) =>
                    res(ctx.json(hardBoard))
            )
        );
        render(<SudokuBoardProvider><Board></Board></SudokuBoardProvider>);

        const dropdown = await waitFor(() => screen.getByRole("button", {name: "Hard"}));
        expect(dropdown).toBeInTheDocument();

        fireEvent.click(screen.getByText("Solve it!"));
        await waitFor(() => screen.getByText("solved"));

        fireEvent.keyDown(screen.getByRole("textbox", {name: "C7"}), {
            target: { key: "Backspace"}
        });
        fireEvent.keyDown(screen.getByRole("textbox", {name: "H8"}), {
            target: { key: "Backspace"}
        });
        fireEvent.keyDown(screen.getByRole("textbox", {name: "C8"}), {
            target: { key: "4"}
        });
        screen.getByRole("checkbox", {name: "unsolved"});

        fireEvent.click(screen.getByText("Solve it!"));
        await waitFor(() => screen.getByText("unsolvable"));
    });
});
