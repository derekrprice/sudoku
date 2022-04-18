import React from 'react';
import { render, screen } from '@testing-library/react';
import Board from "./board";

test('renders the board', () => {
    render(<Board/>);
    const board = screen.getByRole("table");
    expect(board).toBeInTheDocument();
});

test('boards have 9 rows', () => {
    render(<Board />);
    const cells = screen.getAllByRole("row");
    expect(cells).toHaveLength(9);
});

test('boards have 81 cells', () => {
    render(<Board />);
    const cells = screen.getAllByRole("textbox");
    expect(cells).toHaveLength(81);
});
