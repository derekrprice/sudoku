import Cell from "./cell";

type BoardArray = Array<Array<Cell>>;
export default class Puzzle {
    #columns: BoardArray;
    #index: any;
    #rows: BoardArray;
    #squares: BoardArray;
    #status: "broken" | "solved" | "unsolvable" | "unsolved";

    constructor(initializer: Puzzle | Record<string, string> = {}) {
        if (initializer instanceof Puzzle) {
            this.#index = initializer.cells;
            this.#rows = initializer.rows;
            this.#columns = initializer.columns;
            this.#squares = initializer.squares;
            this.#status = initializer.status;
            return;
        }

        this.#status = "unsolved";
        this.#columns = [];
        this.#index = {};
        this.#rows = [];
        this.#squares = [];
        this.#initFromCoordMap(initializer);
    }

    get cells() {
        return this.#index;
    }

    get columns() {
        return this.#columns;
    }

    get rows() {
        return this.#rows;
    }

    get squares() {
        return this.#squares;
    }

    get status() {
        return this.#status;
    }

    /**
     * Clear all mutable cells on the board.
     *
     * @return this
     */
    clear(): Puzzle {
        for(const cell of Object.values<Cell>(this.#index)) {
            if (!cell.immutable) {
                cell.value = null;
                cell.broken = false;
            }
        }
        this.#status = "unsolved";
        return this;
    }

    /**
     * @return a clone of this object.
     */
    clone(): Puzzle {
        return new Puzzle(this);
    }

    /**
     * Assign value to a cell.
     *
     * @param {string} id The ID of the cell to update.
     * @param {number | null} value The value to assign to this cell.
     * @param {boolean} immutable Mark this cell as read-only.  Defaults to false.
     * @return this
     */
    setCell(id: string, value: number | null, immutable: boolean = false): Puzzle {
        this.#index[id].immutable = immutable;
        this.#index[id].value = value;
        return this;
    }

    /**
     * Solve the puzzle
     * @return this
     */
    solve(): Puzzle {
        const unsolved = Object.values<Cell>(this.#index).filter(cell => !cell.value);
        this.#search(unsolved);
        this.validate();
        if (this.#status !== "solved") {
            this.#status = "unsolvable";
        }
        return this;
    }

    /**
     * Mark any broken cells as such and set the board status.
     * @return this
     */
    validate(): Puzzle {
        let broken = false;
        let full = true;
        for (const cell of Object.values<Cell>(this.#index)) {
            full &&= !!cell.value;
            cell.broken = !cell.immutable && !!cell.value && this.#checkCell(cell, cell.value);
            broken ||= cell.broken;
        }

        this.#status = full && !broken ? "solved" : broken ? "broken" : "unsolved";
        return this;
    }

    /**
     * Check to make sure a value is not duplicated in a cell's row, column, or square.
     *
     * @param cell
     * @param {number} value The value to check for this cell.  If null, use cell.value.
     * @return true if value is invalid for this cell.
     * @private
     */
    #checkCell(cell: Cell, value: number): boolean {
        const column = this.#columns[cell.column];
        const row = this.#rows[cell.row];
        const square = this.#squares[cell.square];
        const equalsCell = (cohort: Cell) => cell.id !== cohort.id && cohort.value === value;
        return (
            column.some(equalsCell)
            || row.some(equalsCell)
            || square.some(equalsCell)
        );
    }

    #initFromCoordMap(initializer: Record<string, string>) {
        for (let i = 0; i < 9; i++) {
            this.#rows[i] = [];
            for (let j = 0; j < 9; j++) {
                const sq = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                this.#columns[j] ||= [];
                this.#squares[sq] ||= [];
                const coord = Cell.xyToID(i, j);
                const newCell = new Cell(coord, i, j, sq, parseInt(initializer[coord]) || null);
                this.#squares[sq][this.#squares[sq].length] = this.#index[coord] = this.#rows[i][j] = this.#columns[j][i] = newCell;
            }
        }
    }

    #search(emptyCells: Array<Cell>): boolean {
        if (!emptyCells.length) {
            // Woot!  Solved!
            return true;
        }

        for (let value = 1; value <= 9; value++) {
            if (!this.#checkCell(emptyCells[0], value)) {
                emptyCells[0].value = value;
                const found = this.#search(emptyCells.slice(1));
                if (found) {
                    return found;
                }
            }
        }
        emptyCells[0].value = null;
        return false;
    }
}
